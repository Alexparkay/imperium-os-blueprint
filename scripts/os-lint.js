#!/usr/bin/env node
// OS Lint - the deterministic half of the self-improvement loop.
// Checks the operating system's own claims against disk and reports drift.
// Run weekly or ad-hoc: node scripts/os-lint.js
// Output: console summary + .context/lint/YYYY-MM-DD.md report.
// Exit code 1 if any CRITICAL finding (broken pointer in the always-on instruction layer).

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const HOME = process.env.USERPROFILE || process.env.HOME || '';
const today = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; })(); // local date, not UTC - east-of-UTC mornings were stamping yesterday
const findings = { critical: [], warn: [], info: [] };

function sh(cmd) {
  try { return execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim(); }
  catch (e) { return (e.stdout || '').trim(); }
}
function read(p) { try { return fs.readFileSync(p, 'utf8'); } catch { return ''; } }
function words(p) { const t = read(p); return t ? t.split(/\s+/).length : 0; }
function mdFiles(dir) { try { return fs.readdirSync(dir).filter(f => f.endsWith('.md')); } catch { return []; } }

// ---------- 1. Registry freshness + drift ----------
const regOut = sh('node scripts/generate-registry.js 2>&1');
for (const line of regOut.split('\n')) {
  if (line.startsWith('WARN:')) findings.warn.push(`registry: ${line.slice(5).trim()}`);
}
findings.info.push(`registry regenerated: ${regOut.split('\n')[1] || ''}`);

// ---------- 2. Dead path references in the always-on layer ----------
const alwaysOnFiles = [
  path.join(ROOT, '.claude', 'CLAUDE.md'),
  path.join(ROOT, '.claude', 'rules', 'INDEX.md'),
  ...mdFiles(path.join(ROOT, '.claude', 'rules')).filter(f => f !== 'INDEX.md').map(f => path.join(ROOT, '.claude', 'rules', f)),
  path.join(ROOT, 'context', 'index.md'),
];
const pathRe = /`((?:\.claude|memory|context|clients|automations|scripts|content-pipeline|docs|dashboard|packs)\/[^`\s*]+?)`/g;
for (const file of alwaysOnFiles) {
  const text = read(file);
  let m;
  while ((m = pathRe.exec(text)) !== null) {
    let p = m[1].replace(/[.,;:]+$/, '').replace(/\/$/, '');
    if (p.includes('<') || p.includes('*') || p.includes('|') || p.includes('YYYY') || p.includes('{{')) continue; // templates/placeholders
    if (!fs.existsSync(path.join(ROOT, p))) {
      findings.critical.push(`dead pointer in ${path.relative(ROOT, file)}: \`${p}\` does not exist`);
    }
  }
  // capital Memory/ path check (breaks on case-sensitive filesystems)
  if (/\bMemory\/[a-z_][\w/.-]*/.test(text)) {
    findings.critical.push(`capital Memory/ path in ${path.relative(ROOT, file)} - breaks on case-sensitive filesystems`);
  }
}

// ---------- 3. Duplicate rules: project vs user-global (only if a global tier exists) ----------
const projRules = [...mdFiles(path.join(ROOT, '.claude', 'rules')), ...mdFiles(path.join(ROOT, '.claude', 'rules-import'))];
const globRules = HOME ? mdFiles(path.join(HOME, '.claude', 'rules')) : [];
// In this OS the project copy of every rule is canonical (the product ships them). A same-named
// user-global rule is the owner's own setup; flag the drift risk, never block on it.
const vendorMachine = process.env.OS_VENDOR_MACHINE === "1"; // set on Imperium-staffed machines: their user-global rules serve OTHER projects and must not be deleted
for (const f of projRules) if (globRules.includes(f)) {
  if (vendorMachine) continue;
  let same = false;
  try {
    const projPath = [path.join(ROOT, '.claude', 'rules', f), path.join(ROOT, '.claude', 'rules-import', f)].find(p => fs.existsSync(p));
    same = !!projPath && fs.readFileSync(projPath, "utf8") === fs.readFileSync(path.join(HOME, '.claude', 'rules', f), "utf8");
  } catch {}
  if (same) findings.info.push(`rule ${f} also exists user-globally (identical copy, harmless; project copy is canonical here)`);
  else findings.warn.push(`rule ${f} differs from your user-global ~/.claude/rules/ copy - the project copy is canonical for THIS folder; reconcile the difference (do not blindly delete either)`);
}

// ---------- 4. Stale persistence targets (CLAUDE.md table vs git dates) ----------
const claudeMd = read(path.join(ROOT, '.claude', 'CLAUDE.md'));
const targetRe = /\|\s*`(memory\/[^`]+)`/g;
let tm;
while ((tm = targetRe.exec(claudeMd)) !== null) {
  const p = tm[1].split('`')[0].replace(/ \(.*/, '');
  if (!fs.existsSync(path.join(ROOT, p))) { findings.critical.push(`persistence target missing on disk: ${p}`); continue; }
  const last = sh(`git log -1 --format=%ci -- "${p}"`);
  if (last) {
    const ageDays = Math.floor((Date.now() - new Date(last).getTime()) / 86400000);
    if (ageDays > 45) findings.warn.push(`persistence target stale: ${p} last committed ${ageDays}d ago - still a real target, or retire it from the table?`);
  }
}

// ---------- 5. Instruction budget ----------
const projWords = words(path.join(ROOT, '.claude', 'CLAUDE.md'))
  + mdFiles(path.join(ROOT, '.claude', 'rules')).reduce((s, f) => s + words(path.join(ROOT, '.claude', 'rules', f)), 0)
  + words(path.join(ROOT, 'context', 'index.md'));
const globWords = HOME
  ? words(path.join(HOME, '.claude', 'CLAUDE.md')) + globRules.reduce((s, f) => s + words(path.join(HOME, '.claude', 'rules', f)), 0)
  : 0;
const totalTokens = Math.round((projWords + globWords) * 1.3);
findings.info.push(`instruction budget: project ${projWords}w + user-global ${globWords}w ≈ ${totalTokens} tokens always-on`);
if (totalTokens > 16000) findings.warn.push(`instruction layer over budget: ~${totalTokens} tokens (target <16k, hard ceiling 20k) - trim or demote rules to rules-import`);

// ---------- 6. Unfilled placeholders in the always-on layer ----------
const phHits = sh(`grep -rlE "\\{\\{[A-Z_]+\\}\\}" .claude/CLAUDE.md context 2>/dev/null | head -10`);
if (phHits) findings.warn.push(`unfilled placeholders in: ${phHits.split('\n').join(', ')} - run onboarding to fill them (identity tokens: Phase 1; connector tokens: Phase 4)`);

// ---------- 7. Mojibake scan (UTF-8 double-encoding) ----------
const mojiHits = sh(`grep -rl "â€" --include="*.md" context clients memory .claude 2>/dev/null | head -10`);
if (mojiHits) findings.warn.push(`mojibake (â€/Â) found in: ${mojiHits.split('\n').join(', ')} - fix the file encoding (UTF-8, no BOM)`);

// ---------- 7b. Loose root files (clean-root contract) ----------
const ROOT_ALLOWLIST = new Set(['README.md', 'LICENSE.md', 'Home.md']);
const looseRoot = fs.readdirSync(ROOT).filter(f => {
  const st = fs.statSync(path.join(ROOT, f));
  return st.isFile() && !f.startsWith('.') && !ROOT_ALLOWLIST.has(f);
});
if (looseRoot.length) findings.warn.push(`loose root files (file them or delete; root stays clean): ${looseRoot.join(', ')}`);

// ---------- 7c. Pack integrity (packs/ + installed.json vs live tree) ----------
const packsDir = path.join(ROOT, 'packs');
if (fs.existsSync(packsDir)) {
  let installed = {};
  try { installed = (JSON.parse(read(path.join(packsDir, 'installed.json')) || '{"packs":{}}').packs) || {}; }
  catch { findings.critical.push('packs/installed.json is not valid JSON - pack install/uninstall will refuse to run'); }
  const routingText = read(path.join(ROOT, '.claude', 'reference', 'skills-routing-index.md'));
  const packDirs = fs.readdirSync(packsDir).filter(d => { try { return fs.statSync(path.join(packsDir, d)).isDirectory(); } catch { return false; } });
  for (const name of Object.keys(installed)) {
    if (!packDirs.includes(name)) findings.critical.push(`packs/installed.json lists '${name}' but packs/${name}/ does not exist`);
  }
  for (const p of packDirs) {
    const manifestPath = path.join(packsDir, p, 'pack.md');
    if (!fs.existsSync(manifestPath)) { findings.warn.push(`pack ${p}: missing pack.md manifest`); continue; }
    const fmMatch = read(manifestPath).match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) { findings.warn.push(`pack ${p}: pack.md has no YAML frontmatter`); continue; }
    const skillsMatch = fmMatch[1].match(/^skills:\s*\n((?:[ \t]+-[ \t]+.*\n?)+)/m);
    const manifestSkills = skillsMatch ? skillsMatch[1].split('\n').map(l => l.replace(/^[ \t]+-[ \t]+/, '').trim()).filter(Boolean) : [];
    if (!manifestSkills.length) { findings.warn.push(`pack ${p}: pack.md skills list is empty or failed to parse`); continue; }
    const skillsOnDisk = fs.existsSync(path.join(packsDir, p, 'skills'))
      ? fs.readdirSync(path.join(packsDir, p, 'skills')).filter(d => { try { return fs.statSync(path.join(packsDir, p, 'skills', d)).isDirectory(); } catch { return false; } })
      : [];
    for (const s of manifestSkills) if (!skillsOnDisk.includes(s)) findings.warn.push(`pack ${p}: manifest lists skill '${s}' but packs/${p}/skills/${s}/ does not exist`);
    for (const s of skillsOnDisk) if (!manifestSkills.includes(s)) findings.warn.push(`pack ${p}: packs/${p}/skills/${s}/ exists but the manifest does not list it`);
    if (installed[p]) {
      for (const s of manifestSkills) {
        if (!fs.existsSync(path.join(ROOT, '.claude', 'skills', s, 'SKILL.md'))) findings.critical.push(`installed pack ${p}: skill '${s}' missing from .claude/skills/ - reinstall or fix packs/installed.json`);
        if (!routingText.includes(`\`${s}\``)) findings.warn.push(`installed pack ${p}: skill '${s}' not routed in skills-routing-index.md`);
      }
    }
  }
}

// ---------- 8. Git hygiene ----------
const status = sh('git status --porcelain');
if (status) findings.warn.push(`uncommitted work (rules-import/06): ${status.split('\n').length} paths dirty`);

// ---------- Report ----------
const lines = [`# OS Lint - ${today}`, ''];
for (const [level, list] of [['CRITICAL', findings.critical], ['WARN', findings.warn], ['INFO', findings.info]]) {
  lines.push(`## ${level} (${list.length})`, '');
  for (const f of list) lines.push(`- ${f}`);
  lines.push('');
}
lines.push('## Review gate', '', '- Lint REPORTS; it never auto-edits rules, skills, or memory.',
  '- Fixes to the instruction layer (.claude/) require the owner\'s approval before applying (self-improvement with human-on-the-loop).',
  '- Trivial fixes (regenerating the registry, gitignore additions) may be applied directly and noted in the changelog.', '');

const outDir = path.join(ROOT, '.context', 'lint');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, `${today}.md`), lines.join('\n'), 'utf8');

console.log(`OS LINT - critical: ${findings.critical.length}, warn: ${findings.warn.length}, info: ${findings.info.length}`);
findings.critical.forEach(f => console.log(`  CRITICAL: ${f}`));
findings.warn.forEach(f => console.log(`  WARN: ${f}`));
console.log(`report: .context/lint/${today}.md`);
process.exit(findings.critical.length ? 1 : 0);
