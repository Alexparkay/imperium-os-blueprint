// ============================================================
// Data source for the worker: live Supabase client, or fixtures.
// ------------------------------------------------------------
// Reads SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from the env.
// The service_role key bypasses RLS — this runs server-side
// only, NEVER in a browser.
//
// With NO credentials set (the shipped, dormant state), this
// exports a clearly-logged FIXTURE client that serves the rows
// mirrored from brain/seed (lib/fixtures.js — see the manifest
// at brain/seed/MANIFEST.md). The fixture client supports just
// enough of the supabase-js query surface — from().select()
// .eq().order().limit(), plus accepted-but-not-persisted
// insert/update/upsert — for the whole worker to run end-to-end
// with zero keys.
//
// Every consumer should surface `source` ('fixtures'|'supabase')
// so no human ever mistakes sample data for live data.
// ============================================================

const { loadFixtures } = require('./fixtures');

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let db;
let source;

if (url && serviceKey) {
  // Lazy require: @supabase/supabase-js is only needed in live mode.
  const { createClient } = require('@supabase/supabase-js');
  db = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  source = 'supabase';
  console.log('[db] live Supabase client ready (service_role, server-side only)');
} else {
  db = buildFixtureClient();
  source = 'fixtures';
  console.warn(
    '[db] FIXTURE MODE — SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set. ' +
    'Serving the brain/seed mirror (lib/fixtures.js). Every response is labelled "source": "fixtures".'
  );
}

// ------------------------------------------------------------
// Fixture client — a tiny chainable query builder over the seed
// mirror. Not a full supabase-js implementation; covers what the
// worker uses. Reads only; writes are logged and accepted so
// write paths can be exercised end-to-end, but nothing persists.
// ------------------------------------------------------------
function buildFixtureClient() {
  const data = loadFixtures();

  function from(table) {
    const rows = Array.isArray(data[table]) ? [...data[table]] : [];
    const state = { rows, filters: [], orderBy: null, limitN: null };

    const builder = {
      select() { return builder; },
      eq(col, val) { state.filters.push((r) => r[col] === val); return builder; },
      in(col, vals) { state.filters.push((r) => vals.includes(r[col])); return builder; },
      gte(col, val) { state.filters.push((r) => r[col] >= val); return builder; },
      lte(col, val) { state.filters.push((r) => r[col] <= val); return builder; },
      order(col, opts) { state.orderBy = { col, asc: !(opts && opts.ascending === false) }; return builder; },
      limit(n) { state.limitN = n; return builder; },
      _resolve() {
        let out = state.rows.filter((r) => state.filters.every((f) => f(r)));
        if (state.orderBy) {
          const { col, asc } = state.orderBy;
          out = [...out].sort((a, b) => (a[col] > b[col] ? 1 : a[col] < b[col] ? -1 : 0) * (asc ? 1 : -1));
        }
        if (state.limitN != null) out = out.slice(0, state.limitN);
        return out;
      },
      then(resolve, reject) {
        return Promise.resolve({ data: builder._resolve(), error: null }).then(resolve, reject);
      },
      // Writes are accepted but not persisted in fixture mode —
      // the audit/approval plumbing still runs, so the discipline
      // is exercisable before any database exists.
      insert(payload) {
        const arr = Array.isArray(payload) ? payload : [payload];
        console.log(`[db:fixtures] insert into ${table} (${arr.length} row(s)) — not persisted in fixture mode`);
        return Promise.resolve({ data: arr, error: null });
      },
      update(payload) {
        console.log(`[db:fixtures] update ${table} — not persisted in fixture mode`);
        return Promise.resolve({ data: [payload], error: null });
      },
      upsert(payload) {
        const arr = Array.isArray(payload) ? payload : [payload];
        console.log(`[db:fixtures] upsert into ${table} (${arr.length} row(s)) — not persisted in fixture mode`);
        return Promise.resolve({ data: arr, error: null });
      },
    };
    return builder;
  }

  return { from };
}

module.exports = { db, source, isFixtures: source === 'fixtures' };
