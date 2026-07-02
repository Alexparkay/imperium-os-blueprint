#!/usr/bin/env node
// Generates .claude/reference/registry.md - the ONE authoritative catalog of
// skills, rules, clients, and automations, read from disk. Inlined counts in
// CLAUDE.md / memory files are banned; they point here instead.
// Usage: node scripts/generate-registry.js   (writes the file, prints drift warnings)

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, '.claude', 'reference', 'registry.md');

function mdFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort();
}

function dirEntries(dir, filterFn) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(d => {
    try { return filterFn(d, fs.statSync(path.join(dir, d))); } catch { return false; }
  });
}

function frontmatterField(file, field) {
  try {
    const text = fs.readFileSync(file, 'utf8').slice(0, 4000);
    const m = text.match(new RegExp(`^${field}:\\s*["']?(.+?)["']?\\s*$`, 'm'));
    if (!m) return null;
    let val = m[1].trim();
    if (val === '|' || val === '>' || val === '|-' || val === '>-') {
      // YAML block scalar: the value is on the following indented line(s)
      const after = text.slice(text.indexOf(m[0]) + m[0].length);
      const line = after.split('\n').find(l => l.trim().length > 0);
      val = line ? line.trim() : '';
    }
    return val ? val.replace(/\s+/g, ' ').slice(0, 160) : null;
  } catch { return null; }
}

function firstLineMatching(file, re) {
  try {
    const lines = fs.readFileSync(file, 'utf8').split('\n').slice(0, 30);
    for (const l of lines) { const m = l.match(re); if (m) return m[1].slice(0, 120); }
  } catch { /* noop */ }
  return null;
}

const lines = [];
const warnings = [];
const now = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; })(); // local date, not UTC - east-of-UTC mornings were stamping yesterday

lines.push('---', 'title: Registry (generated)', 'type: index', 'status: generated', `updated: ${now}`, '---', '');
lines.push('# Registry - generated from disk, do not hand-edit');
lines.push('');
lines.push(`Regenerate: \`node scripts/generate-registry.js\` · Generated: ${now}`);
lines.push('');

// ---- Skills ----
const skillsDir = path.join(ROOT, '.claude', 'skills');
const skills = mdFiles(skillsDir);
lines.push(`## Skills (${skills.length} in .claude/skills/)`);
lines.push('');
for (const f of skills) {
  const name = f.replace(/\.md$/, '');
  const desc = frontmatterField(path.join(skillsDir, f), 'description');
  if (!desc) warnings.push(`skill ${name}: no frontmatter description (hurts auto-trigger)`);
  lines.push(`- **${name}** - ${desc ? desc + (desc.length >= 160 ? '…' : '') : '(no description)'}`);
}
const archiveDir = path.join(skillsDir, '_archive');
const archived = mdFiles(archiveDir);
if (archived.length) {
  lines.push('', `### Archived skills (${archived.length} in .claude/skills/_archive/)`);
  for (const f of archived) lines.push(`- ${f.replace(/\.md$/, '')}`);
}
lines.push('');

// ---- Rules ----
const rulesDir = path.join(ROOT, '.claude', 'rules');
const alwaysRules = mdFiles(rulesDir).filter(f => f !== 'INDEX.md');
const importRules = mdFiles(path.join(ROOT, '.claude', 'rules-import'));
// Optional user-global tier: only counted if the owner has set one up.
const HOME = process.env.USERPROFILE || process.env.HOME || '';
const globalRulesDir = HOME ? path.join(HOME, '.claude', 'rules') : '';
const globalRules = globalRulesDir ? mdFiles(globalRulesDir) : [];
lines.push(`## Rules (${alwaysRules.length} always-on · ${importRules.length} import${globalRules.length ? ` · ${globalRules.length} user-global` : ''})`);
lines.push('');
lines.push(`- Always-on (.claude/rules/): ${alwaysRules.map(f => f.replace(/\.md$/, '')).join(' · ')}`);
lines.push(`- Import (.claude/rules-import/): ${importRules.map(f => f.replace(/\.md$/, '')).join(' · ')}`);
if (globalRules.length) {
  lines.push(`- User-global (~/.claude/rules/): ${globalRules.map(f => f.replace(/\.md$/, '')).join(' · ')}`);
}
lines.push('- Tiers + triggers: `.claude/rules/INDEX.md`');
lines.push('');

// duplication check: same rule file in project and user-global (they drift)
for (const f of [...alwaysRules, ...importRules]) {
  if (globalRules.includes(f) && process.env.OS_VENDOR_MACHINE !== "1") {
    let same = false;
    try {
      const projPath = [path.join(rulesDir, f), path.join(ROOT, '.claude', 'rules-import', f)].find(p => fs.existsSync(p));
      same = !!projPath && fs.readFileSync(projPath, "utf8") === fs.readFileSync(path.join(globalRulesDir, f), "utf8");
    } catch {}
    if (!same) warnings.push(`rule ${f} differs from the user-global ~/.claude/rules/ copy - project copy is canonical for this folder; reconcile (do not blindly delete either)`);
  }
}

// ---- Clients ----
const clientsDir = path.join(ROOT, 'clients');
const clients = dirEntries(clientsDir, (d, st) => !d.startsWith('_') && st.isDirectory());
lines.push(`## Clients (${clients.length} active dirs in clients/)`);
lines.push('');
for (const c of clients.sort()) {
  const status = path.join(clientsDir, c, 'STATUS.md');
  let note = '(no STATUS.md)';
  if (fs.existsSync(status)) {
    note = firstLineMatching(status, /\*\*Status:\*\*\s*(.+)/) || firstLineMatching(status, /^#\s*(.+)/) || '';
  } else {
    warnings.push(`client ${c}: missing STATUS.md`);
  }
  lines.push(`- **${c}** - ${note}`);
}
if (!clients.length) lines.push('- (none yet - copy clients/_TEMPLATE/ when the first client lands)');
lines.push('');

// ---- Automations ----
const autoDir = path.join(ROOT, 'automations');
const autos = dirEntries(autoDir, (d, st) => !d.startsWith('_') && st.isDirectory() && d !== 'lib');
lines.push(`## Automations (${autos.length} active dirs in automations/, excl. lib/, _archive/)`);
lines.push('');
lines.push(autos.length ? autos.sort().map(a => `\`${a}\``).join(' · ') : '(none)');
lines.push('');

// ---- Routing index drift ----
const routingPath = path.join(ROOT, '.claude', 'reference', 'skills-routing-index.md');
if (fs.existsSync(routingPath)) {
  const routing = fs.readFileSync(routingPath, 'utf8');
  const missing = skills.map(f => f.replace(/\.md$/, '')).filter(n => !routing.includes(n));
  if (missing.length) {
    warnings.push(`routing index missing ${missing.length} skills: ${missing.join(', ')}`);
    lines.push(`## Drift: skills missing from skills-routing-index.md (${missing.length})`);
    lines.push('');
    lines.push(missing.map(m => `\`${m}\``).join(' · '));
    lines.push('');
  }
}

if (warnings.length) {
  lines.push('## Warnings (fix these)');
  lines.push('');
  for (const w of warnings) lines.push(`- ${w}`);
  lines.push('');
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, lines.join('\n'), 'utf8');
console.log(`registry written: ${path.relative(ROOT, OUT)}`);
console.log(`skills=${skills.length} rules(always/import)=${alwaysRules.length}/${importRules.length} clients=${clients.length} automations=${autos.length}`);
for (const w of warnings) console.warn(`WARN: ${w}`);
