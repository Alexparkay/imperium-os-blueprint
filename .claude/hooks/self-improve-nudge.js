#!/usr/bin/env node
// Stop hook - report-only self-improvement nudger.
// NEVER writes skills or memory itself; it only emits a systemMessage nudge
// when the session shows a capture opportunity the operator might want:
//   (a) SKILL CANDIDATE - a heavy multi-step task ran (>= 12 tool_use entries)
//       with no Skill invocation and no .claude/skills/ file edited
//       -> "say 'make it a skill' to capture it"
//   (b) MEMORY PERSIST - the braindump parser flagged this session's input
//       but nothing under memory/ was written -> nudge to persist
//
// Wired in .claude/settings.json under hooks.Stop, after anti-fold-check.js.
// Rate limit: at most ONE nudge per session (flag file under .context/).
// Fast path: scans at most the last 4000 transcript lines (tail-read, ~4MB cap).
// Fails open: ANY error -> valid empty JSON + exit 0. A broken nudge must
// never block a response. Payload parsing follows anti-fold-check.js.

const fs = require('fs');
const path = require('path');

const MAX_LINES = 4000;
const MAX_TAIL_BYTES = 4 * 1024 * 1024;
const MIN_TOOL_USES = 12;

let raw = '';
process.stdin.on('data', (chunk) => { raw += chunk; });
process.stdin.on('end', () => {
  try { run(JSON.parse(raw || '{}')); }
  catch (err) { logError(err); emptyExit(); }
});

function run(input) {
  if (input.stop_hook_active) { emptyExit(); return; }

  const transcriptPath = input.transcript_path;
  if (!transcriptPath || !fs.existsSync(transcriptPath)) { emptyExit(); return; }

  // Rate limit: one nudge per session, keyed by session id (transcript name as fallback).
  const sessionId = String(input.session_id || path.basename(transcriptPath, '.jsonl')).replace(/[^\w-]/g, '');
  const flagDir = path.join(projectDir(), '.context', 'nudge-flags');
  const flagFile = path.join(flagDir, `${sessionId}.nudged`);
  if (fs.existsSync(flagFile)) { emptyExit(); return; }

  const lines = tailLines(transcriptPath, MAX_LINES, MAX_TAIL_BYTES);

  let toolUses = 0;
  let skillInvoked = false;
  let skillFileEdited = false;
  let memoryWritten = false;
  let braindumpMarker = false;

  for (const line of lines) {
    // Cheap substring checks before any JSON parse.
    if (!braindumpMarker && line.includes('[braindump-router]')) braindumpMarker = true;
    if (!line.includes('"tool_use"')) continue;
    const msg = safeParse(line);
    const content = msg && msg.message && msg.message.content;
    if (!Array.isArray(content)) continue;
    for (const block of content) {
      if (!block || block.type !== 'tool_use') continue;
      toolUses++;
      if (block.name === 'Skill') skillInvoked = true;
      const fp = normalize(block.input && (block.input.file_path || block.input.notebook_path) || '');
      if (!fp) continue;
      if (/(^|\/)\.claude\/skills\//.test(fp)) skillFileEdited = true;
      if (/(^|\/)memory\//.test(fp)) memoryWritten = true;
    }
  }

  let nudge = null;
  if (toolUses >= MIN_TOOL_USES && !skillInvoked && !skillFileEdited) {
    nudge = "This looked like a repeatable workflow (heavy multi-step run, no skill used) - say 'make it a skill' to capture it for next time.";
    logRecord({ kind: 'skill_candidate', toolUses });
  } else if (braindumpMarker && !memoryWritten) {
    nudge = 'A brain dump came through this session but nothing landed in memory/ - worth persisting the decisions/facts from it before they evaporate (rule 03).';
    logRecord({ kind: 'memory_persist', toolUses });
  }

  if (!nudge) { emptyExit(); return; }

  try {
    fs.mkdirSync(flagDir, { recursive: true });
    fs.writeFileSync(flagFile, new Date().toISOString());
  } catch (_) { /* best effort; still nudge */ }

  process.stdout.write(JSON.stringify({ systemMessage: `[self-improve] ${nudge}` }));
  process.exit(0);
}

// --- helpers ---

// Read at most the last maxBytes of the file, return at most maxLines lines.
function tailLines(file, maxLines, maxBytes) {
  const size = fs.statSync(file).size;
  const start = Math.max(0, size - maxBytes);
  const fd = fs.openSync(file, 'r');
  try {
    const buf = Buffer.alloc(size - start);
    fs.readSync(fd, buf, 0, buf.length, start);
    const lines = buf.toString('utf8').split('\n');
    if (start > 0) lines.shift(); // first line is likely partial
    return lines.slice(-maxLines);
  } finally {
    fs.closeSync(fd);
  }
}

function normalize(p) { return String(p).replace(/\\/g, '/'); }

function safeParse(line) {
  try { return JSON.parse(line); } catch { return null; }
}

function emptyExit() {
  process.stdout.write('{}');
  process.exit(0);
}

function logRecord(record) {
  try {
    const dir = path.join(projectDir(), '.context', 'nudge-flags');
    fs.mkdirSync(dir, { recursive: true });
    const today = new Date().toISOString().slice(0, 10);
    fs.appendFileSync(path.join(dir, `${today}.jsonl`), JSON.stringify({ ts: new Date().toISOString(), ...record }) + '\n');
  } catch (_) { /* best effort */ }
}

function logError(err) {
  try {
    const dir = path.join(projectDir(), '.context', 'nudge-flags');
    fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(path.join(dir, 'errors.log'), `[${new Date().toISOString()}] ${err.stack || err.message}\n`);
  } catch (_) { /* best effort */ }
}

function projectDir() {
  return process.env.CLAUDE_PROJECT_DIR || path.resolve(__dirname, '..', '..');
}
