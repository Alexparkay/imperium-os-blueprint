#!/usr/bin/env node
/**
 * sync-env.js - propagate the root .env master to every consumer.
 *
 * The root .env is the ONLY file you edit (copy .env.example to .env first).
 * This regenerates each module's local .env from the master, so their existing
 * loaders keep working unchanged.
 *
 *   node scripts/sync-env.js            # sync local module .env files (safe)
 *   node scripts/sync-env.js --dry      # show what would change, write nothing
 *
 * Safety:
 *   - Backs up every target file before writing (.context/env-backup-<date>/).
 *   - REFUSES to write if a target currently holds a key the manifest doesn't
 *     list (prevents silently dropping a key the module still needs).
 *   - Never prints secret values.
 *
 * Adding a module: add an entry to MANIFEST below (file path + the keys it
 * needs), add the keys to the root .env, re-run.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const dry = process.argv.includes('--dry');

const stamp = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; })(); // local date, not UTC - east-of-UTC mornings were stamping yesterday
const backupDir = path.join(ROOT, '.context', `env-backup-${stamp}`);

function parseEnv(text) {
  const m = new Map();
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 0) continue;
    m.set(line.slice(0, eq).replace(/^export\s+/, '').trim(), line.slice(eq + 1));
  }
  return m;
}

const masterPath = path.join(ROOT, '.env');
if (!fs.existsSync(masterPath)) {
  console.error('No root .env found. Copy .env.example to .env and fill in your keys first.');
  process.exit(1);
}
const master = parseEnv(fs.readFileSync(masterPath, 'utf8'));

// module -> { file, keys[] }. keys MUST be a superset of what the file holds.
const MANIFEST = {
  youtube: {
    file: 'automations/youtube/.env',
    keys: ['APIFY_API_TOKEN'],
  },
  notify: {
    file: 'automations/notify/.env',
    keys: ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID'],
  },
};

let aborted = false;
const plans = [];

for (const [name, m] of Object.entries(MANIFEST)) {
  const fp = path.join(ROOT, m.file);
  const existing = fs.existsSync(fp) ? parseEnv(fs.readFileSync(fp, 'utf8')) : new Map();
  const manifestSet = new Set(m.keys);

  // Guard: never drop a key the target currently has.
  const orphaned = [...existing.keys()].filter(k => !manifestSet.has(k));
  if (orphaned.length) {
    console.error(`ABORT ${name}: ${m.file} holds key(s) not in manifest: ${orphaned.join(', ')}`);
    console.error('  Add them to MANIFEST.' + name + '.keys (and to the master) before syncing.');
    aborted = true;
  }

  // Warn: manifest key missing from master.
  const missing = m.keys.filter(k => !master.has(k));
  if (missing.length) console.warn(`  warn ${name}: master has no value for ${missing.join(', ')} (skipped)`);

  // Count changes vs current.
  let changed = 0, added = 0;
  for (const k of m.keys) {
    if (!master.has(k)) continue;
    if (!existing.has(k)) added++;
    else if (existing.get(k) !== master.get(k)) changed++;
  }
  plans.push({ name, fp, file: m.file, keys: m.keys, changed, added });
  console.log(`  ${name}: ${m.keys.filter(k => master.has(k)).length} keys  (+${added} new, ~${changed} changed)`);
}

if (aborted) { console.error('\nNo files written (guard tripped).'); process.exit(1); }

if (dry) { console.log('\n--dry: nothing written.'); process.exit(0); }

fs.mkdirSync(backupDir, { recursive: true });
for (const p of plans) {
  if (fs.existsSync(p.fp)) fs.copyFileSync(p.fp, path.join(backupDir, p.name + '.env.bak'));
  const lines = [
    `# AUTO-GENERATED from root .env by scripts/sync-env.js (${stamp}).`,
    `# Do NOT edit here - edit the root .env master and re-run sync-env.js.`,
    '',
  ];
  for (const k of p.keys) if (master.has(k)) lines.push(`${k}=${master.get(k)}`);
  fs.mkdirSync(path.dirname(p.fp), { recursive: true });
  fs.writeFileSync(p.fp, lines.join('\n') + '\n');
  console.log(`  wrote ${p.file}`);
}
console.log(`\nLocal sync done. Backups in ${path.relative(ROOT, backupDir)}/`);
