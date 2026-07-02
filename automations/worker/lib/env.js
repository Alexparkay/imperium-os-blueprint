// ============================================================
// Tiny .env loader — zero dependencies.
// ------------------------------------------------------------
// Loads the repo-root .env (the master env file, per the OS
// standard: one .env at the root, never per-module copies) into
// process.env WITHOUT overriding variables already set in the
// environment. Missing file is fine — the worker is designed to
// boot with zero configuration.
//
// Deliberately minimal: KEY=VALUE lines, # comments, optional
// surrounding quotes. No expansion, no multiline values. If the
// activation engagement needs more, swap in dotenv then.
// ============================================================

const fs = require('fs');
const path = require('path');

function loadRootEnv() {
  const envPath = path.join(__dirname, '..', '..', '..', '.env');
  let text;
  try {
    text = fs.readFileSync(envPath, 'utf8');
  } catch (_) {
    return false; // no .env — fixture mode, by design
  }
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
  return true;
}

module.exports = { loadRootEnv };
