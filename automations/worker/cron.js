// ============================================================
// cron.js — the daily-brief scheduler. DORMANT by default.
// ------------------------------------------------------------
// Behind a kill-switch: nothing schedules unless ENABLE_CRONS is
// exactly "true". Default OFF, so a fresh install never runs
// background jobs by surprise — the OS-wide stance is pull over
// push; a scheduled brief is an activation decision, not a
// default.
//
// The daily brief job:
//   1. pulls the day's picture from the Brain (pending approvals,
//      recent activity),
//   2. computes the metrics in CODE (counts — never generated),
//   3. asks the reporting agent (a stub until activation) for a
//      decision-first markdown brief,
//   4. writes it to daily_brief through the audited write path.
//
// Scheduling is dependency-free: a once-a-minute clock check in
// WORKER_TZ (IANA name, default UTC) against DAILY_BRIEF_AT
// (HH:MM, default 07:00). Swap in a proper cron library at
// activation if the company needs more than one schedule.
//
// Run the scheduler:              node cron.js   (needs ENABLE_CRONS=true)
// Run the job once, right now:    node cron.js --once
// ============================================================

require('./lib/env').loadRootEnv();

const { db } = require('./lib/supabase');
const { runAgent } = require('./lib/agents');
const { safeWrite } = require('./lib/writes');

const TZ = process.env.WORKER_TZ || 'UTC';
const AT = process.env.DAILY_BRIEF_AT || '07:00';

// Local date + HH:MM in the configured timezone.
function nowIn(tz) {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(new Date()).map((p) => [p.type, p.value]));
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`,
  };
}

async function generateDailyBrief() {
  const [approvals, activity, documents] = await Promise.all([
    db.from('approval_queue').select('*').eq('status', 'pending'),
    db.from('team_activity').select('*').order('created_at', { ascending: false }).limit(15),
    db.from('documents').select('*'),
  ]);

  const pending = approvals.data || [];
  const act = activity.data || [];
  const briefDate = nowIn(TZ).date;

  // Metrics are computed here, in code, from the rows — the agent
  // formats them but never invents them (financial-accuracy rule).
  const metrics = {
    pending_approvals: pending.length,
    team_activity_rows: act.length,
    documents: (documents.data || []).length,
  };

  const result = runAgent('reporting', 'Generate the morning brief. Lead with what needs attention.', {
    date: briefDate,
    pending_approvals: pending,
    team_activity: act,
    metrics,
  });

  const writeRes = await safeWrite({
    table: 'daily_brief',
    row: { brief_date: briefDate, content_md: result.text, metrics },
    actionType: 'brief_write',
    actor: 'cron:daily-brief',
  });

  console.log(`[cron] daily brief generated for ${briefDate} (agent: ${result.stub ? 'stub' : 'live'}).`);
  return writeRes;
}

// --- entry point ---
const runOnce = process.argv.includes('--once');

if (runOnce) {
  generateDailyBrief()
    .then(() => process.exit(0))
    .catch((e) => { console.error('[cron] daily brief failed:', e.message); process.exit(1); });
} else if (process.env.ENABLE_CRONS === 'true') {
  // Validate the timezone up front so a typo fails loudly at boot,
  // not silently at 07:00.
  try { nowIn(TZ); } catch (e) {
    console.error(`[cron] invalid WORKER_TZ "${TZ}": ${e.message} — not scheduling.`);
    process.exit(1);
  }
  if (!/^\d{2}:\d{2}$/.test(AT)) {
    console.error(`[cron] invalid DAILY_BRIEF_AT "${AT}" (expected HH:MM) — not scheduling.`);
    process.exit(1);
  }
  let lastRunDate = null;
  console.log(`[cron] daily brief scheduled at ${AT} ${TZ}. ENABLE_CRONS=true.`);
  setInterval(() => {
    const { date, time } = nowIn(TZ);
    if (time === AT && lastRunDate !== date) {
      lastRunDate = date;
      generateDailyBrief().catch((e) => console.error('[cron] daily brief failed:', e.message));
    }
  }, 30 * 1000);
} else {
  console.log('[cron] ENABLE_CRONS is not "true" — kill-switch ON, nothing scheduled (the shipped default).');
  console.log('[cron] run the brief once with:  node cron.js --once');
}

module.exports = { generateDailyBrief };
