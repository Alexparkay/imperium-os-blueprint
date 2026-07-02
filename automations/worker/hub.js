// ============================================================
// hub.js — the worker's hub. DORMANT MODULE: boots with zero
// credentials and serves labelled fixture data until activated.
// ------------------------------------------------------------
// An Express server with three jobs:
//   1. Webhook intake (connectors and external systems push
//      events in at POST /webhook/event).
//   2. THE EVENT ROUTER — one switch over event type. This is
//      the hub. Agents are stateless functions the router calls.
//      There is NO peer-to-peer: agents never call each other,
//      only the router calls agents (hub-and-spoke).
//   3. /api/* endpoints any cockpit proxies to (GET /api/overview
//      is the anchor payload).
//
// Every WRITE goes through lib/writes.js, which appends an
// audit_log row and — for money / legal / external-comms action
// types (ACTION_POLICY) — parks the action in approval_queue
// instead of executing it.
//
// ZERO-CREDENTIAL BOOT: with no SUPABASE_URL, lib/supabase.js
// serves the brain/seed mirror (lib/fixtures.js) and every
// response carries "source": "fixtures" so sample data can never
// be mistaken for live data.
//
// Run locally:  npm install && node hub.js
// ============================================================

require('./lib/env').loadRootEnv();

const express = require('express');

const { db, source } = require('./lib/supabase');
const { runAgent } = require('./lib/agents');
const { safeWrite, appendAudit } = require('./lib/writes');
const { readAllStatuses } = require('./lib/status');

// Connectors (each: async run() → status object). One reference
// connector ships; activation engagements add the company's real
// pipes here following the same shape.
const connectors = {
  'example-sheets': require('./connectors/example-sheets'),
};

const app = express();
app.use(express.json({ limit: '2mb' }));

// ============================================================
// THE EVENT ROUTER — the hub. One switch over event type.
// Agents are stateless functions; only the router invokes them.
// ============================================================
async function route(event) {
  const { type, payload = {} } = event || {};
  switch (type) {
    // ---- connector sync events -------------------------------
    case 'sync.example-sheets':
      return connectors['example-sheets'].run();
    case 'sync.all': {
      const out = {};
      for (const name of Object.keys(connectors)) out[name] = await connectors[name].run();
      return out;
    }

    // ---- agent events (hub-and-spoke; router → agent) --------
    case 'ask.knowledge': {
      const ctx = await retrieveDocs(payload.query);
      return runAgent('knowledge', payload.query || '', ctx);
    }
    case 'generate.report': {
      const ctx = await reportContext();
      return runAgent('reporting', payload.query || 'Generate the report.', ctx);
    }

    // ---- write events (audited; approval-gated by type) ------
    case 'write.team_activity':
      return safeWrite({
        table: 'team_activity',
        row: payload,
        actionType: 'activity_log',
        actor: payload.actor || 'worker:hub',
      });
    case 'propose.action':
      // Generic proposal: the actionType decides the route.
      // Money / legal / external-comms types (and any UNKNOWN
      // type — fail closed) park in approval_queue; the rest
      // write directly, audited either way.
      return safeWrite({
        table: payload.table || 'team_activity',
        row: payload.row || {},
        actionType: payload.action_type,
        actor: payload.actor || 'worker:hub',
        title: payload.title,
      });

    // ---- approval decisions ----------------------------------
    case 'approval.decide':
      return decideApproval(payload);

    default:
      return { ok: false, error: `unknown event type: ${type}` };
  }
}

// ============================================================
// Retrieval helpers for the agents (read-only context builders)
// ============================================================
async function retrieveDocs(query = '') {
  const { data } = await db.from('documents').select('*');
  const docs = Array.isArray(data) ? data : [];
  // Naive keyword relevance — real retrieval (embeddings) is an
  // activation upgrade; the contract (docs in, answer out) holds.
  const terms = String(query).toLowerCase().split(/\s+/).filter(Boolean);
  return docs
    .map((d) => {
      const hay = `${d.title || ''} ${d.body_text || ''}`.toLowerCase();
      const score = terms.reduce((s, t) => s + (hay.includes(t) ? 1 : 0), 0);
      return { d, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ d }) => d);
}

async function reportContext() {
  const [approvals, activity, briefs] = await Promise.all([
    db.from('approval_queue').select('*').eq('status', 'pending'),
    db.from('team_activity').select('*').order('created_at', { ascending: false }).limit(10),
    db.from('daily_brief').select('*').order('brief_date', { ascending: false }).limit(1),
  ]);
  const pending = approvals.data || [];
  const act = activity.data || [];
  return {
    date: new Date().toISOString().slice(0, 10),
    pending_approvals: pending,
    team_activity: act,
    // metrics computed by CODE — agents format them, never invent them
    metrics: {
      pending_approvals: pending.length,
      team_activity_rows: act.length,
      last_brief_date: ((briefs.data || [])[0] || {}).brief_date || null,
    },
  };
}

async function decideApproval({ id, decision, decided_by }) {
  if (!['approved', 'rejected'].includes(decision)) {
    return { ok: false, error: 'decision must be approved | rejected' };
  }
  await db.from('approval_queue')
    .update({ status: decision, decided_at: new Date().toISOString(), decided_by })
    .eq('id', id);
  await appendAudit({
    actor: decided_by || 'unknown',
    action: `approval.${decision}`,
    entity: `approval_queue:${id}`,
  });
  return { ok: true, id, decision };
}

// ============================================================
// /api/* — the cockpit reads these (server-side proxy target).
// Every payload carries `source` so fixture data is never silent.
// ============================================================

// The anchor payload: one call, the whole picture.
app.get('/api/overview', async (req, res) => {
  try {
    const [documents, approvals, activity, brief] = await Promise.all([
      db.from('documents').select('*'),
      db.from('approval_queue').select('*').eq('status', 'pending'),
      db.from('team_activity').select('*').order('created_at', { ascending: false }).limit(15),
      db.from('daily_brief').select('*').order('brief_date', { ascending: false }).limit(1),
    ]);

    const docs = documents.data || [];
    const pending = approvals.data || [];
    const act = activity.data || [];

    res.json({
      generated_at: new Date().toISOString(),
      source, // 'fixtures' until SUPABASE_URL + service key are set
      kpis: {
        documents: docs.length,
        pending_approvals: pending.length,
        team_activity_recent: act.length,
        last_brief_date: ((brief.data || [])[0] || {}).brief_date || null,
      },
      documents: docs,
      pending_approvals: pending,
      team_activity: act,
      daily_brief: (brief.data || [])[0] || null,
      connector_status: readAllStatuses(),
    });
  } catch (err) {
    res.status(500).json({ ok: false, source, error: err.message });
  }
});

// Per-connector status stamps (so a cockpit can render every pipe's state).
app.get('/api/connectors', (req, res) => res.json({ source, connectors: readAllStatuses() }));

// Pending approval queue.
app.get('/api/approvals', async (req, res) => {
  const { data } = await db.from('approval_queue').select('*').eq('status', 'pending');
  res.json({ source, approvals: data || [] });
});

// Latest daily brief.
app.get('/api/brief', async (req, res) => {
  const { data } = await db.from('daily_brief').select('*').order('brief_date', { ascending: false }).limit(1);
  res.json({ source, brief: (data || [])[0] || null });
});

// Health probe.
app.get('/health', (req, res) =>
  res.json({ ok: true, service: 'worker', source })
);

// ============================================================
// Webhook intake — external systems push events here.
// ============================================================
app.post('/webhook/event', async (req, res) => {
  try {
    const result = await route(req.body);
    res.json({ ok: true, source, result });
  } catch (err) {
    res.status(500).json({ ok: false, source, error: err.message });
  }
});

// ============================================================
// Boot
// ============================================================
const PORT = process.env.WORKER_PORT || 8080;

// Export route() + app for cron.js and tests; only listen when run directly.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[worker] listening on :${PORT}  (source: ${source})`);
    console.log('[worker] hub-and-spoke router ready. No peer-to-peer agent calls.');
    if (source === 'fixtures') {
      console.log('[worker] FIXTURE MODE — every response is labelled "source": "fixtures". Activation guide: docs/connectors/worker.md');
    }
  });
}

module.exports = { app, route };
