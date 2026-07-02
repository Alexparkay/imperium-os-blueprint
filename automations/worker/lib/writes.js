// ============================================================
// Write helpers — the ONLY sanctioned path for data into the
// Brain. Every write goes through here so that:
//   1. an audit_log row is ALWAYS appended (actor / action /
//      entity / payload), and
//   2. action types matching money / legal / external-comms
//      rules are parked in approval_queue and NOT executed
//      until a human approves them.
//
// hub.js, cron.js, and the connectors call these. Nothing
// writes to the Brain directly. This keeps the hub-and-spoke
// discipline auditable: the router (and the connectors it
// invokes) are the only writers, and every write leaves a trail.
// ============================================================

const { db } = require('./supabase');

// ------------------------------------------------------------
// ACTION_POLICY — the enforcement map. Each action type is
// either 'direct' (write straight through, audited) or
// 'approve' (park in approval_queue for human sign-off).
//
// The approve list covers the three protected categories:
//   money           payment, refund, invoice_send, payout,
//                   pricing_change, expense_over_budget
//   legal           contract, legal_notice
//   external comms  external_email, external_message,
//                   external_publish
//
// UNKNOWN action types FAIL CLOSED: anything not in the map is
// treated as 'approve'. A new action type must be added here
// deliberately to earn direct-write status.
// ------------------------------------------------------------
const ACTION_POLICY = {
  // direct (internal, reversible, no money/legal/external surface)
  data_sync: 'direct',
  internal_note: 'direct',
  activity_log: 'direct',
  brief_write: 'direct',
  document_ingest: 'direct',

  // money
  payment: 'approve',
  refund: 'approve',
  invoice_send: 'approve',
  payout: 'approve',
  pricing_change: 'approve',
  expense_over_budget: 'approve',

  // legal
  contract: 'approve',
  legal_notice: 'approve',

  // external comms
  external_email: 'approve',
  external_message: 'approve',
  external_publish: 'approve',
};

function needsApproval(actionType) {
  return (ACTION_POLICY[actionType] || 'approve') === 'approve';
}

// appendAudit — always called on a write. Never throws the caller
// out; an audit-append failure is logged loudly but does not
// block the operation (which is separately recorded by its own
// insert result).
async function appendAudit({ actor, action, entity, payload = null }) {
  try {
    await db.from('audit_log').insert({ actor, action, entity, payload });
  } catch (err) {
    console.error(`[writes] audit append FAILED for ${action}/${entity}: ${err.message}`);
  }
}

// enqueueApproval — park a money/legal/external-comms action for
// a human decision. Returns the queued row (or the fixture echo).
async function enqueueApproval({ actionType, title, payload, proposedBy = 'worker:hub' }) {
  const row = { action_type: actionType, title, payload, proposed_by: proposedBy, status: 'pending' };
  const res = await db.from('approval_queue').insert(row);
  await appendAudit({
    actor: proposedBy,
    action: 'approval.enqueued',
    entity: `approval_queue:${actionType}`,
    payload: { title },
  });
  return res;
}

// safeWrite — the main helper.
//   table       Brain table to write into
//   row         the row to insert
//   actionType  semantic kind (drives the ACTION_POLICY routing)
//   actor       who/what initiated (default 'worker:hub')
//   title       human-readable summary (used if parked for approval)
//
// If actionType needs approval, the row is NOT written to the
// target table; it is parked in approval_queue and the caller
// gets { queued: true }. Otherwise it is written and audited,
// and the caller gets { written: true, data }.
async function safeWrite({ table, row, actionType = 'data_sync', actor = 'worker:hub', title }) {
  if (needsApproval(actionType)) {
    await enqueueApproval({
      actionType,
      title: title || `${actionType} pending approval`,
      payload: { table, row },
      proposedBy: actor,
    });
    return { queued: true, written: false, table, actionType };
  }

  const res = await db.from(table).insert(row);
  await appendAudit({
    actor,
    action: `write.${table}`,
    entity: table,
    payload: row,
  });
  return { queued: false, written: true, table, data: res && res.data };
}

// safeUpsert — the same discipline for connectors that reconcile
// rows against an external source. Upserts are always 'direct'
// in intent (data sync) but still audited.
async function safeUpsert({ table, rows, actor = 'worker:hub' }) {
  const arr = Array.isArray(rows) ? rows : [rows];
  const res = await db.from(table).upsert(arr);
  await appendAudit({
    actor,
    action: `upsert.${table}`,
    entity: table,
    payload: { count: arr.length },
  });
  return { written: true, table, count: arr.length, data: res && res.data };
}

module.exports = { safeWrite, safeUpsert, enqueueApproval, appendAudit, needsApproval, ACTION_POLICY };
