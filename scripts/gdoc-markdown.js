#!/usr/bin/env node
// Universal Markdown → Google Docs formatter
// Parses markdown and creates a properly styled Google Doc via the gws CLI
// (install + auth guide: docs/connectors/google-workspace-gws.md)
//
// Usage:
//   node gdoc-markdown.js <docId> <markdownFile>
//   node gdoc-markdown.js <docId> --stdin   (reads from stdin)
//
// Supports: # headings (H1-H6), **bold**, *italic*, - bullet lists, --- horizontal rules,
//           `code spans`, and proper paragraph spacing.
//
// Flags:
//   --dry-run    Parse and show section count without calling Google API
//   --debug      Show parsed sections for inspection
//
// gws resolution: set GWS_CLI_JS in the root .env to the absolute path of
// @googleworkspace/cli's run-gws.js if auto-detection fails.

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const os = require('os');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const DEBUG = args.includes('--debug');
const positional = args.filter(a => !a.startsWith('--') || a === '--stdin').filter(a => a !== '--dry-run' && a !== '--debug');

const DOC_ID = positional[0];
const source = positional[1];

if (!DOC_ID || !source) {
  console.error('Usage: node gdoc-markdown.js <docId> <markdownFile> [--dry-run] [--debug]');
  console.error('       node gdoc-markdown.js <docId> --stdin [--dry-run] [--debug]');
  process.exit(1);
}

// Resolve the gws CLI entry point (no hardcoded user paths).
function resolveGwsScript() {
  if (process.env.GWS_CLI_JS && fs.existsSync(process.env.GWS_CLI_JS)) return process.env.GWS_CLI_JS;
  try {
    const globalRoot = execSync('npm root -g', { encoding: 'utf8' }).trim();
    const candidate = path.join(globalRoot, '@googleworkspace', 'cli', 'run-gws.js');
    if (fs.existsSync(candidate)) return candidate;
  } catch (_) { /* fall through */ }
  return null;
}

// Read markdown content
let markdown;
if (source === '--stdin') {
  markdown = fs.readFileSync(0, 'utf8');
} else {
  markdown = fs.readFileSync(source, 'utf8');
}

// Sanitise Windows cmd.exe special chars
function sanitize(text) {
  return text
    .replace(/\|/g, '│')   // | → unicode vertical bar
    .replace(/&/g, 'and')        // & → "and"
    .replace(/(?<!\\)>/g, '›')  // > → unicode angle quote (not escaped >)
    .replace(/(?<!\\)</g, '‹')  // < → unicode angle quote
    .replace(/%/g, '％')     // % → fullwidth percent
    .replace(/\^/g, '‸');   // ^ → caret
}

// Pre-process: convert markdown tables into bullet points
// Tables render broken in Google Docs - this converts them before parsing
function convertTablesToBullets(md) {
  const lines = md.split('\n');
  const result = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    // Detect table: line contains | and has at least 2 columns
    if (/^\s*\|(.+\|)+\s*$/.test(line)) {
      // Collect all table rows
      const tableRows = [];
      while (i < lines.length && /^\s*\|(.+\|)+\s*$/.test(lines[i])) {
        const cells = lines[i].split('|').map(c => c.trim()).filter(c => c.length > 0);
        tableRows.push(cells);
        i++;
      }
      // Skip separator rows (e.g. |---|---|)
      const dataRows = tableRows.filter(row => !row.every(cell => /^[-:]+$/.test(cell)));
      if (dataRows.length === 0) continue;

      const headers = dataRows[0];
      // If only header row, output as a single bullet
      if (dataRows.length === 1) {
        result.push('- ' + headers.join(' / '));
        continue;
      }
      // Convert each data row to a bullet using header labels
      for (let r = 1; r < dataRows.length; r++) {
        const row = dataRows[r];
        const parts = [];
        for (let c = 0; c < row.length; c++) {
          if (row[c]) {
            const label = headers[c] ? `**${headers[c]}:** ` : '';
            parts.push(label + row[c]);
          }
        }
        result.push('- ' + parts.join(' / '));
      }
    } else {
      result.push(line);
      i++;
    }
  }
  return result.join('\n');
}

// Parse markdown into structured sections
// Each section: { text, style, boldRanges[], italicRanges[] }
function parseMarkdown(md) {
  md = convertTablesToBullets(md);
  const lines = md.split('\n');
  const sections = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines (they'll be handled as spacing between sections)
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Horizontal rule: ---, ***, ___
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line.trim())) {
      // Insert a thin horizontal rule - uses a styled line separator
      sections.push({ text: '─'.repeat(40), style: 'HR', boldRanges: [], italicRanges: [] });
      i++;
      continue;
    }

    // Heading detection: # H1, ## H2, ### H3, #### H4, etc.
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      let headingText = headingMatch[2].replace(/\*\*/g, '').replace(/\*/g, '').trim();
      headingText = sanitize(headingText);
      // H1 → TITLE (largest, most prominent)
      // H2 → HEADING_1, H3 → HEADING_2, H4 → HEADING_3, etc.
      const styleMap = {
        1: 'TITLE',
        2: 'HEADING_1',
        3: 'HEADING_2',
        4: 'HEADING_3',
        5: 'HEADING_4',
        6: 'HEADING_5'
      };
      const style = styleMap[level] || 'HEADING_5';
      // Make all headings bold for visual punch
      const boldRanges = [{ start: 0, end: headingText.length }];
      sections.push({
        text: headingText,
        style,
        boldRanges,
        italicRanges: []
      });
      i++;
      continue;
    }

    // Bullet list: collect consecutive lines starting with - or *
    if (/^\s*[-*+]\s+/.test(line)) {
      const bulletLines = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        const bulletText = lines[i].replace(/^\s*[-*+]\s+/, '').trim();
        bulletLines.push(sanitize(bulletText));
        i++;
      }
      // Each bullet line is a separate section that will get bullet formatting
      for (const bl of bulletLines) {
        const { cleanText, boldRanges, italicRanges } = extractInlineFormatting(bl);
        sections.push({
          text: cleanText,
          style: 'BULLET',
          boldRanges,
          italicRanges
        });
      }
      continue;
    }

    // Normal text paragraph: collect lines until next empty line, heading, or bullet
    const paragraphLines = [];
    while (i < lines.length && lines[i].trim() !== '' &&
           !/^#{1,6}\s+/.test(lines[i]) &&
           !/^\s*[-*+]\s+/.test(lines[i]) &&
           !/^(-{3,}|\*{3,}|_{3,})\s*$/.test(lines[i].trim())) {
      paragraphLines.push(lines[i]);
      i++;
    }

    if (paragraphLines.length > 0) {
      const rawText = sanitize(paragraphLines.join('\n'));
      const { cleanText, boldRanges, italicRanges } = extractInlineFormatting(rawText);
      sections.push({
        text: cleanText,
        style: 'NORMAL_TEXT',
        boldRanges,
        italicRanges
      });
    }
  }

  return sections;
}

// Extract **bold** and *italic* markers, return clean text + ranges
function extractInlineFormatting(text) {
  const boldRanges = [];
  const italicRanges = [];

  // First pass: extract **bold** ranges
  let cleanText = '';
  let remaining = text;

  // Process bold (**text**)
  while (remaining.length > 0) {
    const boldStart = remaining.indexOf('**');
    if (boldStart === -1) {
      cleanText += remaining;
      break;
    }
    const boldEnd = remaining.indexOf('**', boldStart + 2);
    if (boldEnd === -1) {
      cleanText += remaining;
      break;
    }

    cleanText += remaining.substring(0, boldStart);
    const boldContent = remaining.substring(boldStart + 2, boldEnd);
    const startIdx = cleanText.length;
    cleanText += boldContent;
    boldRanges.push({ start: startIdx, end: cleanText.length });
    remaining = remaining.substring(boldEnd + 2);
  }

  // Second pass: extract *italic* from the clean text (after bold removal)
  let finalText = '';
  remaining = cleanText;

  while (remaining.length > 0) {
    const italicStart = remaining.indexOf('*');
    if (italicStart === -1) {
      finalText += remaining;
      break;
    }
    const italicEnd = remaining.indexOf('*', italicStart + 1);
    if (italicEnd === -1) {
      finalText += remaining;
      break;
    }

    finalText += remaining.substring(0, italicStart);
    const italicContent = remaining.substring(italicStart + 1, italicEnd);
    const startIdx = finalText.length;
    finalText += italicContent;
    italicRanges.push({ start: startIdx, end: finalText.length });
    remaining = remaining.substring(italicEnd + 1);

    // Adjust bold ranges that come after this italic removal
    const charsRemoved = 2; // two * characters removed
    for (const br of boldRanges) {
      if (br.start > startIdx) {
        br.start -= charsRemoved;
        br.end -= charsRemoved;
      }
    }
  }

  // Handle `code spans` - just strip the backticks for Google Docs
  finalText = finalText.replace(/`([^`]+)`/g, '$1');

  return { cleanText: finalText, boldRanges, italicRanges };
}

// Build Google Docs API requests from parsed sections
function buildRequests(sections) {
  const insertRequests = [];
  const styleRequests = [];
  const bulletRanges = [];
  let currentIndex = 1;

  for (const section of sections) {
    const text = section.text + '\n';
    const textLen = text.length;

    // Insert text
    insertRequests.push({
      insertText: {
        location: { index: currentIndex },
        text: text
      }
    });

    // Apply paragraph style (heading, subtitle, title)
    if (section.style === 'HR') {
      // Horizontal rule: make text small (8pt) and light gray
      styleRequests.push({
        updateTextStyle: {
          range: {
            startIndex: currentIndex,
            endIndex: currentIndex + textLen - 1 // exclude trailing \n
          },
          textStyle: {
            fontSize: { magnitude: 8, unit: 'PT' },
            foregroundColor: {
              color: { rgbColor: { red: 0.75, green: 0.75, blue: 0.75 } }
            }
          },
          fields: 'fontSize,foregroundColor'
        }
      });
    } else if (section.style !== 'NORMAL_TEXT' && section.style !== 'BULLET') {
      styleRequests.push({
        updateParagraphStyle: {
          range: {
            startIndex: currentIndex,
            endIndex: currentIndex + 1
          },
          paragraphStyle: {
            namedStyleType: section.style
          },
          fields: 'namedStyleType'
        }
      });
    }

    // Track bullet ranges for createParagraphBullets
    if (section.style === 'BULLET') {
      bulletRanges.push({
        startIndex: currentIndex,
        endIndex: currentIndex + textLen
      });
    }

    // Apply bold formatting
    for (const br of section.boldRanges) {
      styleRequests.push({
        updateTextStyle: {
          range: {
            startIndex: currentIndex + br.start,
            endIndex: currentIndex + br.end
          },
          textStyle: { bold: true },
          fields: 'bold'
        }
      });
    }

    // Apply italic formatting
    for (const ir of section.italicRanges) {
      styleRequests.push({
        updateTextStyle: {
          range: {
            startIndex: currentIndex + ir.start,
            endIndex: currentIndex + ir.end
          },
          textStyle: { italic: true },
          fields: 'italic'
        }
      });
    }

    currentIndex += textLen;
  }

  // Create bullet requests (merge consecutive bullet ranges)
  const mergedBullets = mergeBulletRanges(bulletRanges);
  for (const br of mergedBullets) {
    styleRequests.push({
      createParagraphBullets: {
        range: {
          startIndex: br.startIndex,
          endIndex: br.endIndex
        },
        bulletPreset: 'BULLET_DISC_CIRCLE_SQUARE'
      }
    });
  }

  return [...insertRequests, ...styleRequests];
}

// Merge consecutive bullet ranges into single createParagraphBullets calls
function mergeBulletRanges(ranges) {
  if (ranges.length === 0) return [];
  const merged = [{ ...ranges[0] }];
  for (let i = 1; i < ranges.length; i++) {
    const last = merged[merged.length - 1];
    if (ranges[i].startIndex === last.endIndex) {
      last.endIndex = ranges[i].endIndex;
    } else {
      merged.push({ ...ranges[i] });
    }
  }
  return merged;
}

// Execute requests in batches
// Strategy: write JSON to temp files, spawn a tiny Node worker that reads them
// and calls gws via execFileSync with an args array - ZERO shell escaping issues
function executeBatches(requests) {
  const GWS_SCRIPT = resolveGwsScript();
  if (!GWS_SCRIPT) {
    console.error('Could not locate the gws CLI (@googleworkspace/cli).');
    console.error('Install: npm install -g @googleworkspace/cli  (then authenticate, see docs/connectors/google-workspace-gws.md)');
    console.error('Or set GWS_CLI_JS in the root .env to the absolute path of run-gws.js');
    process.exit(1);
  }

  const BATCH_SIZE = 4;
  const batches = [];
  for (let i = 0; i < requests.length; i += BATCH_SIZE) {
    batches.push(requests.slice(i, i + BATCH_SIZE));
  }

  console.log(`Formatting Google Doc: ${batches.length} batches (${requests.length} requests)...`);

  const paramsJson = JSON.stringify({ documentId: DOC_ID });

  // Inline worker: reads JSON from temp files, calls the gws JS entry point directly
  // via execFileSync('node', [...]) - NO shell, NO escaping, \n stays as \n
  const workerScript = `
    const fs = require('fs');
    const { execFileSync } = require('child_process');
    const paramsFile = process.argv[2];
    const bodyFile = process.argv[3];
    const gwsScript = process.argv[4];
    const params = fs.readFileSync(paramsFile, 'utf8');
    const body = fs.readFileSync(bodyFile, 'utf8');
    const r = execFileSync(process.execPath, [
      gwsScript, 'docs', 'documents', 'batchUpdate',
      '--params', params, '--json', body
    ], { encoding: 'utf8', maxBuffer: 10*1024*1024 });
    process.stdout.write(r);
  `;

  const workerFile = path.join(os.tmpdir(), 'gdoc-md-worker.js');
  fs.writeFileSync(workerFile, workerScript);

  const paramsFile = path.join(os.tmpdir(), 'gdoc-md-params.json');
  const bodyFile = path.join(os.tmpdir(), 'gdoc-md-body.json');
  fs.writeFileSync(paramsFile, paramsJson);

  for (let i = 0; i < batches.length; i++) {
    const bodyJson = JSON.stringify({ requests: batches[i] });
    fs.writeFileSync(bodyFile, bodyJson);

    try {
      // Spawn Node with the worker - it reads JSON from files and passes to gws
      // via execFileSync args array, so \n stays as \n (no shell mangling)
      const result = execSync(`node "${workerFile}" "${paramsFile}" "${bodyFile}" "${GWS_SCRIPT}"`, {
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024
      });

      // Check for API errors in response
      if (result && result.includes('"error"') && result.includes('"code"')) {
        console.error(`Batch ${i + 1} API error:`, result.substring(0, 300));
        process.exit(1);
      }

      // Progress indicator
      if ((i + 1) % 10 === 0 || i === batches.length - 1) {
        console.log(`  ${i + 1}/${batches.length}`);
      }
    } catch (e) {
      console.error(`Batch ${i + 1} failed:`, (e.stderr || e.message).substring(0, 500));
      process.exit(1);
    }
  }

  // Cleanup
  try { fs.unlinkSync(workerFile); fs.unlinkSync(paramsFile); fs.unlinkSync(bodyFile); } catch (_) {}
}

// Main
const sections = parseMarkdown(markdown);
console.log(`Parsed ${sections.length} sections from markdown`);

if (DEBUG) {
  for (const s of sections) {
    const preview = s.text.substring(0, 80).replace(/\n/g, '\\n');
    const bold = s.boldRanges.length > 0 ? ` [${s.boldRanges.length} bold]` : '';
    const italic = s.italicRanges.length > 0 ? ` [${s.italicRanges.length} italic]` : '';
    console.log(`  ${s.style.padEnd(12)} ${preview}${bold}${italic}`);
  }
}

const requests = buildRequests(sections);

if (DRY_RUN) {
  const headings = requests.filter(r => r.updateParagraphStyle).length;
  const bolds = requests.filter(r => r.updateTextStyle && r.updateTextStyle.textStyle.bold).length;
  const italics = requests.filter(r => r.updateTextStyle && r.updateTextStyle.textStyle.italic).length;
  const bullets = requests.filter(r => r.createParagraphBullets).length;
  console.log(`\nDry run summary:`);
  console.log(`  ${sections.length} sections | ${requests.length} API requests`);
  console.log(`  ${headings} headings | ${bolds} bold ranges | ${italics} italic ranges | ${bullets} bullet groups`);
  process.exit(0);
}

executeBatches(requests);

console.log(`\nDone! https://docs.google.com/document/d/${DOC_ID}/edit`);
