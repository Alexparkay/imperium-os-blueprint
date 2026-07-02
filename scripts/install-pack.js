#!/usr/bin/env node
// Department pack installer/uninstaller.
// Usage: node scripts/install-pack.js <pack>              (install)
//        node scripts/install-pack.js <pack> --uninstall  (exact reverse)
//        node scripts/install-pack.js <pack> --uninstall --force  (remove even if installed copies were modified)
//
// Install copies the pack's skills/rules-import/memory/templates into the live
// tree, appends the manifest's routing (and rules-index) rows, regenerates the
// registry, appends a marked changelog entry, and records everything placed in
// packs/installed.json. Uninstall is the exact reverse of that record; after
// uninstall + registry regen the working tree is byte-identical to before
// install. No partial states: install pre-flights every conflict and rolls
// back on any failure; uninstall pre-checks every file before removing any.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const PACKS_DIR = path.join(ROOT, 'packs');
const STATE_FILE = path.join(PACKS_DIR, 'installed.json');
const ROUTING_FILE = path.join(ROOT, '.claude', 'reference', 'skills-routing-index.md');
const RULES_INDEX_FILE = path.join(ROOT, '.claude', 'rules', 'INDEX.md');
const CHANGELOG_FILE = path.join(ROOT, 'memory', 'system_changelog.md');

function die(msg) { console.error(`ERROR: ${msg}`); process.exit(1); }
function today() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }

// ---------- tiny helpers ----------
function readState() {
  if (!fs.existsSync(STATE_FILE)) return { packs: {} };
  try { const s = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); return s && typeof s === 'object' ? { packs: s.packs || {} } : { packs: {} }; }
  catch { die(`packs/installed.json is not valid JSON - fix it before installing/uninstalling`); }
}
function writeState(state) { fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + '\n', 'utf8'); }

function listFilesRec(dir, base = dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const e of fs.readdirSync(dir)) {
    const p = path.join(dir, e);
    if (fs.statSync(p).isDirectory()) out.push(...listFilesRec(p, base));
    else out.push(path.relative(base, p).split(path.sep).join('/'));
  }
  return out;
}
function copyFile(src, dst) { fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(src, dst); }
function sameContent(a, b) {
  try { return fs.readFileSync(a).equals(fs.readFileSync(b)); } catch { return false; }
}
function removeFileAndEmptyDirs(file, stopDir) {
  if (fs.existsSync(file)) fs.unlinkSync(file);
  let dir = path.dirname(file);
  while (dir.length > stopDir.length && fs.existsSync(dir) && fs.readdirSync(dir).length === 0) {
    fs.rmdirSync(dir);
    dir = path.dirname(dir);
  }
}

// ---------- manifest parsing ----------
function parseManifest(packName) {
  const packDir = path.join(PACKS_DIR, packName);
  const manifestPath = path.join(packDir, 'pack.md');
  if (!fs.existsSync(manifestPath)) die(`packs/${packName}/pack.md not found - is '${packName}' a pack?`);
  const text = fs.readFileSync(manifestPath, 'utf8');
  const fmMatch = text.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) die(`packs/${packName}/pack.md has no YAML frontmatter`);
  const fm = fmMatch[1];

  function listField(name) {
    const empty = fm.match(new RegExp(`^${name}:\\s*\\[\\s*\\]\\s*$`, 'm'));
    if (empty) return [];
    const m = fm.match(new RegExp(`^${name}:\\s*\\n((?:[ \\t]+-[ \\t]+.*\\n?)+)`, 'm'));
    if (!m) return null;
    return m[1].split('\n').map(l => l.replace(/^[ \t]+-[ \t]+/, '').trim()).filter(Boolean);
  }
  function scalarField(name) {
    const m = fm.match(new RegExp(`^${name}:\\s*["']?(.+?)["']?\\s*$`, 'm'));
    return m ? m[1].trim() : null;
  }
  function tableRows(sectionTitle) {
    // no 'm' flag: $ must mean end-of-string so the capture spans the whole section
    const m = text.match(new RegExp(`\\n## ${sectionTitle}\\s*\\n([\\s\\S]*?)(?=\\n## |$)`));
    if (!m) return [];
    return m[1].split('\n').filter(l => l.startsWith('| `'));
  }

  const manifest = {
    dir: packDir,
    name: scalarField('name'),
    skills: listField('skills') || [],
    connectors: listField('connectors') || [],
    rulesImport: listField('rules_import') || [],
    memory: listField('memory') || [],
    templates: listField('templates') || [],
    routingRows: tableRows('Routing rows'),
    rulesIndexRows: tableRows('Rules index rows'),
  };
  if (manifest.name !== packName) die(`packs/${packName}/pack.md frontmatter name '${manifest.name}' does not match directory name`);

  // manifest skills must match skills/ dir contents exactly
  const onDisk = fs.existsSync(path.join(packDir, 'skills'))
    ? fs.readdirSync(path.join(packDir, 'skills')).filter(d => fs.statSync(path.join(packDir, 'skills', d)).isDirectory()).sort()
    : [];
  const listed = [...manifest.skills].sort();
  if (JSON.stringify(onDisk) !== JSON.stringify(listed)) {
    die(`packs/${packName}: manifest skills list does not match packs/${packName}/skills/ contents\n  manifest: ${listed.join(', ')}\n  on disk:  ${onDisk.join(', ')}`);
  }
  for (const s of manifest.skills) {
    if (!fs.existsSync(path.join(packDir, 'skills', s, 'SKILL.md'))) die(`packs/${packName}/skills/${s}/SKILL.md missing`);
    if (!manifest.routingRows.some(r => r.startsWith(`| \`${s}\``))) die(`packs/${packName}: skill '${s}' has no row in the manifest's '## Routing rows' section`);
  }
  if (manifest.rulesImport.length && !manifest.rulesIndexRows.length) {
    die(`packs/${packName}: rules_import is non-empty but the manifest has no '## Rules index rows' section`);
  }
  return manifest;
}

// ---------- text-file surgery ----------
function appendAfterLastTableRow(filePath, rows) {
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  let last = -1;
  for (let i = 0; i < lines.length; i++) if (lines[i].startsWith('|')) last = i;
  if (last === -1) die(`${path.relative(ROOT, filePath)} has no table to append to`);
  lines.splice(last + 1, 0, ...rows);
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
}
function removeExactLines(filePath, rows) {
  const set = new Set(rows);
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  const kept = [];
  for (const l of lines) { if (set.has(l)) set.delete(l); else kept.push(l); }
  fs.writeFileSync(filePath, kept.join('\n'), 'utf8');
  return set.size === 0; // false = some rows were not found
}
function changelogEntry(packName, manifest) {
  return [
    `<!-- pack-install:${packName} -->`,
    `## ${today()}: installed department pack '${packName}'`,
    '',
    `- **What:** ${manifest.skills.length} skills copied into .claude/skills/ (${manifest.skills.join(', ')})${manifest.templates.length ? `; ${manifest.templates.length} templates into content-pipeline/templates/` : ''}${manifest.memory.length ? `; memory scaffolds: ${manifest.memory.join(', ')}` : ''}`,
    `- **Why:** the ${packName} department pack was installed (node scripts/install-pack.js ${packName})`,
    `- **Files:** see packs/installed.json for the exact record`,
    `<!-- /pack-install:${packName} -->`,
    '',
  ];
}
function insertChangelogEntry(packName, manifest) {
  const lines = fs.readFileSync(CHANGELOG_FILE, 'utf8').split('\n');
  let h1 = lines.findIndex(l => l.startsWith('# '));
  if (h1 === -1) h1 = lines.length - 1;
  lines.splice(h1 + 2, 0, ...changelogEntry(packName, manifest)); // after H1 + its blank line (newest at top)
  fs.writeFileSync(CHANGELOG_FILE, lines.join('\n'), 'utf8');
}
function removeChangelogEntry(packName) {
  const text = fs.readFileSync(CHANGELOG_FILE, 'utf8');
  const re = new RegExp(`<!-- pack-install:${packName} -->[\\s\\S]*?<!-- /pack-install:${packName} -->\\n?\\n?`, '');
  fs.writeFileSync(CHANGELOG_FILE, text.replace(re, ''), 'utf8');
}
function regenRegistry() {
  execSync('node scripts/generate-registry.js', { cwd: ROOT, stdio: ['pipe', 'pipe', 'pipe'] });
}

// ---------- install ----------
function install(packName) {
  const manifest = parseManifest(packName);
  const state = readState();
  if (state.packs[packName]) die(`pack '${packName}' is already installed (see packs/installed.json)`);

  // Build the full placement plan first
  const plan = { skills: [], rulesImport: [], memory: [], templates: [] };
  for (const s of manifest.skills) {
    for (const rel of listFilesRec(path.join(manifest.dir, 'skills', s))) {
      plan.skills.push({ src: path.join(manifest.dir, 'skills', s, rel), dst: path.join(ROOT, '.claude', 'skills', s, rel), rel: `.claude/skills/${s}/${rel}` });
    }
  }
  for (const rel of listFilesRec(path.join(manifest.dir, 'rules-import'))) {
    plan.rulesImport.push({ src: path.join(manifest.dir, 'rules-import', rel), dst: path.join(ROOT, '.claude', 'rules-import', rel), rel: `.claude/rules-import/${rel}` });
  }
  for (const rel of listFilesRec(path.join(manifest.dir, 'memory'))) {
    plan.memory.push({ src: path.join(manifest.dir, 'memory', rel), dst: path.join(ROOT, 'memory', rel), rel: `memory/${rel}` });
  }
  for (const rel of listFilesRec(path.join(manifest.dir, 'templates'))) {
    plan.templates.push({ src: path.join(manifest.dir, 'templates', rel), dst: path.join(ROOT, 'content-pipeline', 'templates', rel), rel: `content-pipeline/templates/${rel}` });
  }

  // Pre-flight: EVERY conflict reported, nothing touched
  const conflicts = [];
  for (const s of manifest.skills) if (fs.existsSync(path.join(ROOT, '.claude', 'skills', s))) conflicts.push(`.claude/skills/${s}/ already exists`);
  for (const f of [...plan.rulesImport, ...plan.memory, ...plan.templates]) if (fs.existsSync(f.dst)) conflicts.push(`${f.rel} already exists`);
  const routingText = fs.readFileSync(ROUTING_FILE, 'utf8');
  for (const s of manifest.skills) if (routingText.includes(`| \`${s}\``)) conflicts.push(`skills-routing-index.md already routes '${s}'`);
  if (conflicts.length) {
    die(`cannot install '${packName}' over existing files (nothing was changed):\n  - ${conflicts.join('\n  - ')}\nRemove/rename the collisions (or uninstall the other source of these files) and retry.`);
  }

  // Snapshot mutable text files for rollback
  const snapshots = new Map();
  for (const p of [ROUTING_FILE, RULES_INDEX_FILE, CHANGELOG_FILE, STATE_FILE]) snapshots.set(p, fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null);
  const placed = [];

  try {
    for (const f of [...plan.skills, ...plan.rulesImport, ...plan.memory, ...plan.templates]) { copyFile(f.src, f.dst); placed.push(f.dst); }
    appendAfterLastTableRow(ROUTING_FILE, manifest.routingRows);
    if (manifest.rulesIndexRows.length) appendAfterLastTableRow(RULES_INDEX_FILE, manifest.rulesIndexRows);
    insertChangelogEntry(packName, manifest);
    state.packs[packName] = {
      installed: today(),
      skills: manifest.skills,
      files: {
        skills: plan.skills.map(f => f.rel),
        rulesImport: plan.rulesImport.map(f => f.rel),
        memory: plan.memory.map(f => f.rel),
        templates: plan.templates.map(f => f.rel),
      },
      routingRows: manifest.routingRows,
      rulesIndexRows: manifest.rulesIndexRows,
    };
    writeState(state);
    regenRegistry();
  } catch (e) {
    // Roll back: delete every placed file, restore every snapshotted text file
    for (const p of placed) { try { removeFileAndEmptyDirs(p, ROOT); } catch { /* keep rolling */ } }
    for (const [p, content] of snapshots) { if (content !== null) fs.writeFileSync(p, content, 'utf8'); }
    try { regenRegistry(); } catch { /* registry restored on next run */ }
    die(`install failed and was rolled back: ${e.message}`);
  }

  console.log(`INSTALLED pack '${packName}': ${manifest.skills.length} skills, ${plan.templates.length} templates, ${plan.memory.length} memory files, ${plan.rulesImport.length} rules.`);
  if (manifest.connectors.length) {
    console.log(`Connector requirements (verify each is wired, or note it as a gap):`);
    for (const c of manifest.connectors) console.log(`  - ${c}`);
  }
  console.log(`Onboarding questions for this pack: packs/${packName}/onboarding.md`);
}

// ---------- uninstall ----------
function uninstall(packName, force) {
  const state = readState();
  const rec = state.packs[packName];
  if (!rec) die(`pack '${packName}' is not installed (see packs/installed.json)`);
  const packDir = path.join(PACKS_DIR, packName);

  const allFiles = [...rec.files.skills, ...rec.files.rulesImport, ...rec.files.memory, ...rec.files.templates];
  // Pre-check EVERYTHING before removing anything
  const modified = [];
  for (const rel of allFiles) {
    const live = path.join(ROOT, rel);
    if (!fs.existsSync(live)) continue; // already gone - warn later, not fatal
    // map back to the pack source path
    let src = null;
    if (rel.startsWith('.claude/skills/')) src = path.join(packDir, 'skills', rel.slice('.claude/skills/'.length));
    else if (rel.startsWith('.claude/rules-import/')) src = path.join(packDir, 'rules-import', rel.slice('.claude/rules-import/'.length));
    else if (rel.startsWith('memory/')) src = path.join(packDir, 'memory', rel.slice('memory/'.length));
    else if (rel.startsWith('content-pipeline/templates/')) src = path.join(packDir, 'templates', rel.slice('content-pipeline/templates/'.length));
    if (src && !sameContent(live, src)) modified.push(rel);
  }
  if (modified.length && !force) {
    die(`these installed files were modified since install (uninstall would lose the edits):\n  - ${modified.join('\n  - ')}\nCommit or copy the changes you want to keep, then re-run with --force. Nothing was removed.`);
  }

  const missing = allFiles.filter(rel => !fs.existsSync(path.join(ROOT, rel)));
  for (const rel of allFiles) removeFileAndEmptyDirs(path.join(ROOT, rel), ROOT);
  const routingClean = removeExactLines(ROUTING_FILE, rec.routingRows || []);
  if (rec.rulesIndexRows && rec.rulesIndexRows.length) removeExactLines(RULES_INDEX_FILE, rec.rulesIndexRows);
  removeChangelogEntry(packName);
  delete state.packs[packName];
  writeState(state);
  regenRegistry();

  console.log(`UNINSTALLED pack '${packName}': ${allFiles.length - missing.length} files removed, routing rows stripped, registry regenerated.`);
  if (missing.length) console.warn(`WARN: ${missing.length} recorded files were already gone: ${missing.join(', ')}`);
  if (!routingClean) console.warn(`WARN: some routing rows were not found verbatim in skills-routing-index.md - check the table by hand`);
  if (modified.length) console.warn(`WARN: --force removed ${modified.length} modified files: ${modified.join(', ')}`);
  console.log(`Verify with: git status --porcelain  (clean = byte-identical to before install)`);
}

// ---------- main ----------
const args = process.argv.slice(2);
const packName = args.find(a => !a.startsWith('--'));
const doUninstall = args.includes('--uninstall');
const force = args.includes('--force');
if (!packName) {
  const available = fs.existsSync(PACKS_DIR) ? fs.readdirSync(PACKS_DIR).filter(d => fs.existsSync(path.join(PACKS_DIR, d, 'pack.md'))) : [];
  die(`usage: node scripts/install-pack.js <pack> [--uninstall] [--force]\navailable packs: ${available.join(', ') || '(none)'}`);
}
if (doUninstall) uninstall(packName, force); else install(packName);
