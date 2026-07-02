#!/usr/bin/env node
// org-sync.js - pull the company's org context repo into context/org/ (org mode).
//
// In org mode (multi-seat), context/org/ is a READ-ONLY mirror of a private
// "org context repo" shared by every seat in the company. This script keeps
// the mirror fresh. In single-seat mode (ORG_CONTEXT_REPO unset) it is a no-op.
//
// Usage:
//   node scripts/org-sync.js               # sync (no-op if not configured)
//   node scripts/org-sync.js --status      # configured repo + last sync time
//   node scripts/org-sync.js --propose <file>  # validate a proposal file, remind where it goes
//
// Configuration (repo root .env, or process.env):
//   ORG_CONTEXT_REPO   git URL of the company's org context repo
//                      (e.g. git@github.com:acme/acme-org-context.git)
//
// Semantics:
//   - Shallow clone-or-pull into a cache (.context/org-sync-cache/), then
//     mirror the repo's files into context/org/ (replace-on-pull).
//   - LOCAL-MODIFICATION GUARD: if any file in context/org/ changed since the
//     last sync (hash mismatch vs .context/org-sync-state.json), WARN and
//     ABORT rather than clobber. Seats propose changes via memory/org-proposals/,
//     they never edit org truth directly (rule: .claude/rules-import/32-org-context.md).
//   - No dependencies beyond Node stdlib + the git CLI.
//
// Exit codes: 0 = synced or clean no-op · 1 = aborted (guard) or sync failure.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const ORG_DIR = path.join(ROOT, 'context', 'org');
const CACHE_DIR = path.join(ROOT, '.context', 'org-sync-cache');
const STATE_FILE = path.join(ROOT, '.context', 'org-sync-state.json');
const PROPOSALS_DIR = path.join(ROOT, 'memory', 'org-proposals');

// --- load repo root .env (minimal parser, no dotenv dependency; same as automations/notify) ---
const envPath = path.join(ROOT, '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m || line.trim().startsWith('#')) continue;
    let value = m[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(m[1] in process.env)) process.env[m[1]] = value;
  }
}

const REPO = (process.env.ORG_CONTEXT_REPO || '').trim();
const args = process.argv.slice(2);

function sh(cmd, opts = {}) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], ...opts }).trim();
}

function readState() {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); } catch { return null; }
}

function writeState(state) {
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

function hashFile(p) {
  return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
}

// All files under dir (relative paths, forward slashes), skipping .git.
function listFiles(dir, base = dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir)) {
    if (entry === '.git') continue;
    const full = path.join(dir, entry);
    const st = fs.statSync(full);
    if (st.isDirectory()) out.push(...listFiles(full, base));
    else out.push(path.relative(base, full).split(path.sep).join('/'));
  }
  return out;
}

// --- --status ---
if (args[0] === '--status') {
  if (!REPO) {
    console.log('org-sync: not configured (single-seat mode). Set ORG_CONTEXT_REPO in the root .env to enable org mode.');
    process.exit(0);
  }
  console.log(`org-sync: configured repo: ${REPO}`);
  const state = readState();
  if (state && state.lastSync) {
    console.log(`org-sync: last sync: ${state.lastSync} (${Object.keys(state.files || {}).length} files mirrored into context/org/)`);
  } else {
    console.log('org-sync: never synced on this machine yet. Run: node scripts/org-sync.js');
  }
  process.exit(0);
}

// --- --propose <file> ---
if (args[0] === '--propose') {
  const file = args[1];
  if (!file) {
    console.error('org-sync: usage: node scripts/org-sync.js --propose <path-to-proposal.md>');
    process.exit(1);
  }
  const abs = path.resolve(ROOT, file);
  if (!fs.existsSync(abs)) {
    console.error(`org-sync: proposal file not found: ${file}`);
    process.exit(1);
  }
  const rel = path.relative(ROOT, abs).split(path.sep).join('/');
  const inPlace = rel.startsWith('memory/org-proposals/');
  const named = /^\d{4}-\d{2}-\d{2}-[a-z0-9-]+\.md$/.test(path.basename(abs));
  console.log(`org-sync: proposal found: ${rel}`);
  if (!inPlace) console.log('org-sync: NOTE - proposals live in memory/org-proposals/ as YYYY-MM-DD-<slug>.md. Move it there so it survives and gets picked up.');
  else if (!named) console.log('org-sync: NOTE - name the file YYYY-MM-DD-<slug>.md (see memory/org-proposals/README.md).');
  console.log('org-sync: next step (v1 is honest, no network magic): send the file to the org admin - they review and merge it into the org context repo, and every seat receives it on its next sync.');
  process.exit(0);
}

// --- default: sync ---
if (!REPO) {
  console.log('org-sync: ORG_CONTEXT_REPO not set - single-seat mode, nothing to sync.');
  process.exit(0);
}

try {
  // 1. Local-modification guard: compare context/org/ against the last-synced hashes.
  const state = readState();
  if (state && state.files) {
    const modified = [];
    for (const [rel, hash] of Object.entries(state.files)) {
      const p = path.join(ORG_DIR, rel);
      if (!fs.existsSync(p)) { modified.push(`${rel} (deleted locally)`); continue; }
      if (hashFile(p) !== hash) modified.push(rel);
    }
    if (modified.length) {
      console.error('org-sync: ABORT - local modifications detected in context/org/ (read-only in org mode):');
      for (const m of modified) console.error(`  - ${m}`);
      console.error('org-sync: org truth is edited via the org context repo, never here. Save your change as a proposal (memory/org-proposals/README.md), then restore the files (git checkout -- context/org/) and re-run the sync.');
      process.exit(1);
    }
  }

  // 2. Shallow clone-or-pull into the cache.
  fs.mkdirSync(path.dirname(CACHE_DIR), { recursive: true });
  if (fs.existsSync(path.join(CACHE_DIR, '.git'))) {
    const cachedRemote = sh('git remote get-url origin', { cwd: CACHE_DIR });
    if (cachedRemote !== REPO) {
      fs.rmSync(CACHE_DIR, { recursive: true, force: true }); // repo changed - start clean
    }
  }
  if (fs.existsSync(path.join(CACHE_DIR, '.git'))) {
    sh('git fetch --depth 1 origin HEAD', { cwd: CACHE_DIR });
    sh('git reset --hard FETCH_HEAD', { cwd: CACHE_DIR });
  } else {
    fs.rmSync(CACHE_DIR, { recursive: true, force: true });
    sh(`git clone --depth 1 "${REPO}" "${CACHE_DIR}"`);
  }

  // 3. Mirror cache -> context/org/ (replace-on-pull).
  const remoteFiles = listFiles(CACHE_DIR);
  if (!remoteFiles.length) {
    console.error('org-sync: ABORT - the org repo cloned empty. Not wiping context/org/ over an empty remote; check the repo.');
    process.exit(1);
  }
  fs.mkdirSync(ORG_DIR, { recursive: true });
  const newHashes = {};
  for (const rel of remoteFiles) {
    const src = path.join(CACHE_DIR, rel);
    const dst = path.join(ORG_DIR, rel);
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
    newHashes[rel] = hashFile(dst);
  }
  // Remove files we mirrored previously that the remote no longer has.
  let removed = 0;
  if (state && state.files) {
    for (const rel of Object.keys(state.files)) {
      if (!newHashes[rel] && fs.existsSync(path.join(ORG_DIR, rel))) {
        fs.rmSync(path.join(ORG_DIR, rel));
        removed++;
      }
    }
  }

  // 4. Stamp the state file.
  const head = sh('git rev-parse --short HEAD', { cwd: CACHE_DIR });
  writeState({ repo: REPO, lastSync: new Date().toISOString(), commit: head, files: newHashes });
  console.log(`org-sync: synced ${remoteFiles.length} files into context/org/ (commit ${head}${removed ? `, ${removed} removed` : ''}).`);
  process.exit(0);
} catch (err) {
  console.error(`org-sync: sync failed: ${(err.message || String(err)).split('\n')[0]}`);
  console.error('org-sync: context/org/ was left as it was. Fix the connection (docs/connectors/org-sync.md, "What can go wrong") and re-run.');
  process.exit(1);
}
