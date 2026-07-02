// ============================================================
// Agents — stateless stubs, wired to a model at activation.
// ------------------------------------------------------------
// Two core agents ship with the dormant worker:
//   knowledge  — answers questions from the `documents` table
//                (RAG target)
//   reporting  — turns structured rows into a decision-first
//                markdown brief
//
// BOTH ARE STUBS. They deterministically FORMAT the data passed
// to them and label the output [STUB]. The model call (Anthropic
// API or the company's chosen provider) is wired here during the
// activation engagement — same signatures, so no consumer
// changes: runAgent(name, task, context) stays the contract.
//
// Design rules that survive activation:
//   - Agents are STATELESS: pure functions of (task, context).
//   - Agents NEVER call each other. Only the router in hub.js
//     (and cron.js for the brief) invokes them — hub-and-spoke.
//   - Agents never invent figures. Numbers in a brief come from
//     the metrics computed by code, never from generation.
// ============================================================

const AGENTS = {
  // knowledge — answers from provided documents only.
  knowledge(task, context) {
    const docs = Array.isArray(context) ? context : [];
    const listing = docs.length
      ? docs.map((d) => `- ${d.title} (${d.doc_type || 'doc'})`).join('\n')
      : '- (no matching documents)';
    return [
      `[STUB knowledge agent] Model calls are wired at activation; this is a deterministic formatting stub.`,
      `Task: ${String(task).slice(0, 200)}`,
      `Documents retrieved (${docs.length}):`,
      listing,
      docs.length ? `\nTop match excerpt:\n${String(docs[0].body_text || '').slice(0, 300)}` : '',
    ].filter(Boolean).join('\n');
  },

  // reporting — decision-first brief over structured rows.
  reporting(task, context) {
    const c = context || {};
    const approvals = c.pending_approvals || [];
    const activity = c.team_activity || [];
    const metrics = c.metrics || {};
    const lines = [
      `# Daily brief (${c.date || 'today'}) — [STUB reporting agent]`,
      '',
      '_Deterministic formatting stub. A model call replaces this at activation; the metrics below are computed by code either way._',
      '',
      '## What needs attention',
      approvals.length
        ? approvals.map((a) => `- APPROVAL PENDING: ${a.title}`).join('\n')
        : '- Nothing waiting for sign-off.',
      '',
      '## Recent activity',
      activity.length
        ? activity.slice(0, 5).map((t) => `- ${t.person_ref}: ${t.activity}`).join('\n')
        : '- No activity rows.',
      '',
      '## Metrics (computed, not generated)',
      Object.entries(metrics).map(([k, v]) => `- ${k}: ${JSON.stringify(v)}`).join('\n') || '- (none)',
    ];
    return lines.join('\n');
  },
};

// runAgent — the single entry point. Stateless; the only caller
// is the router (hub.js) and the brief cron.
function runAgent(name, task, context) {
  const fn = AGENTS[name];
  if (!fn) throw new Error(`[agents] unknown agent: ${name}`);
  return { agent: name, stub: true, text: fn(task, context) };
}

module.exports = { runAgent, AGENTS };
