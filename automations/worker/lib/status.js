// ============================================================
// Connector status discipline.
// ------------------------------------------------------------
// Every connector ALWAYS writes a status stamp, on every run,
// whether it ran live, served fixtures, or errored. Cockpit
// surfaces read these so they can show "last run / mode / rows"
// for each pipe and NEVER render a blank or a silent guess.
//
// Stamps land in .status/<connector>.json under the worker dir
// (gitignored — runtime artifacts, never source). The shape is
// stable and consumer-readable:
//   { connector, ok, mode: 'live'|'fixtures'|'error',
//     rows, message, detail, last_run_at }
// ============================================================

const fs = require('fs');
const path = require('path');

const STATUS_DIR = path.join(__dirname, '..', '.status');

function ensureDir() {
  try {
    fs.mkdirSync(STATUS_DIR, { recursive: true });
  } catch (_) {
    /* directory may already exist */
  }
}

// writeStatus(connector, fields)
//   connector  e.g. 'example-sheets'
//   fields     { mode: 'live'|'fixtures'|'error', ok: bool,
//                rows?: number, message?: string, detail?: any }
function writeStatus(connector, fields = {}) {
  ensureDir();
  const payload = {
    connector,
    ok: fields.ok !== false,
    mode: fields.mode || 'fixtures',
    rows: fields.rows ?? null,
    message: fields.message || '',
    detail: fields.detail ?? null,
    last_run_at: new Date().toISOString(),
  };
  const file = path.join(STATUS_DIR, `${connector}.json`);
  try {
    fs.writeFileSync(file, JSON.stringify(payload, null, 2));
  } catch (err) {
    console.error(`[status] could not write ${file}: ${err.message}`);
  }
  return payload;
}

// readAllStatuses() — for the overview payload.
function readAllStatuses() {
  ensureDir();
  const out = {};
  let files = [];
  try {
    files = fs.readdirSync(STATUS_DIR).filter((f) => f.endsWith('.json'));
  } catch (_) {
    return out;
  }
  for (const f of files) {
    try {
      out[f.replace(/\.json$/, '')] = JSON.parse(fs.readFileSync(path.join(STATUS_DIR, f), 'utf8'));
    } catch (_) {
      /* skip unreadable status file */
    }
  }
  return out;
}

module.exports = { writeStatus, readAllStatuses, STATUS_DIR };
