// ============================================================
// Connector: example-sheets — the reference connector shape.
// ------------------------------------------------------------
// ONE connector ships with the dormant worker, shaped exactly
// like a real one so activation engagements copy the pattern:
//
//   1. CONFIG CHECK   — are the env keys present?
//   2. FETCH-OR-FIXTURES — pull from the source, or demonstrate
//                       the pipeline on the seed mirror
//   3. NORMALIZE      — map source rows → Brain table rows
//   4. STATUS STAMP   — ALWAYS write .status/<name>.json
//
// The imagined source is a spreadsheet tab of team activity
// (person, activity, reference) — the lowest-friction way most
// companies already track "who is doing what". Real connectors
// for the company's actual systems are written at activation
// following this same four-step shape.
//
// Unconfigured (the shipped state), it runs the normalize step
// against the fixture rows, writes NOTHING, and stamps status
// mode 'fixtures' — so the pipe is visibly present and testable
// with zero credentials.
// ============================================================

const { writeStatus } = require('../lib/status');
const { safeUpsert } = require('../lib/writes');
const { loadFixtures } = require('../lib/fixtures');

// STEP 3 (defined first so both paths share it): normalize
// source rows into the `team_activity` contract shape.
function normalize(sourceRows) {
  return sourceRows.map((r) => ({
    person_ref: String(r.person || r.person_ref || 'unknown').trim(),
    activity: String(r.activity || '').trim(),
    entity: r.reference || r.entity || null,
  }));
}

async function run() {
  const sheetId = process.env.EXAMPLE_SHEETS_ID;           // which spreadsheet
  const hasAuth = Boolean(process.env.GWS_CLI_JS || process.env.GOOGLE_APPLICATION_CREDENTIALS);

  // STEP 1 — config check. Missing config is a NORMAL state for
  // a dormant module, not an error: degrade to fixtures loudly.
  if (!sheetId || !hasAuth) {
    // STEP 2b — fixtures path: demonstrate the pipeline shape on
    // the seed mirror without writing anything.
    const fixtureRows = loadFixtures().team_activity;
    const normalized = normalize(fixtureRows.map((t) => ({ person: t.person_ref, activity: t.activity, reference: t.entity })));
    // STEP 4 — status stamp, always.
    return writeStatus('example-sheets', {
      mode: 'fixtures', ok: true, rows: normalized.length,
      message: !sheetId
        ? 'No EXAMPLE_SHEETS_ID set — ran the normalize step on fixtures, wrote nothing. Configure at activation.'
        : 'Sheet id set but no Google auth (gws CLI / service account) — fixtures only until auth is wired.',
    });
  }

  try {
    // STEP 2a — live fetch. Wired at activation against the
    // company's own spreadsheet (the OS standard for Google
    // access is the gws CLI — docs/connectors/google-workspace-gws.md).
    // Left as an explicit stub so no fake data is ever written:
    //   const rows = await readSheet(sheetId, 'Activity!A2:C');
    const sourceRows = []; // ← activation wires the real read here

    const normalized = normalize(sourceRows);
    if (normalized.length) {
      await safeUpsert({ table: 'team_activity', rows: normalized, actor: 'connector:example-sheets' });
    }

    // STEP 4 — status stamp, always.
    return writeStatus('example-sheets', {
      mode: 'live', ok: true, rows: normalized.length,
      message: normalized.length
        ? `Synced ${normalized.length} activity row(s) from the sheet.`
        : 'Config + auth present but the fetch is still a stub (0 rows) — wire the sheet read at activation.',
    });
  } catch (err) {
    // STEP 4 — even failure stamps status. Silent pipes are the enemy.
    return writeStatus('example-sheets', { mode: 'error', ok: false, message: err.message });
  }
}

module.exports = { run, normalize };

if (require.main === module) {
  run().then((s) => console.log('[example-sheets]', s)).catch((e) => console.error(e));
}
