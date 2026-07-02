#!/usr/bin/env node
// Stop hook - Rule 27 + Rule 28 enforcement.
// Detects (a) sycophantic position reversals on tool/model recommendations
// without new technical evidence, and (b) tool/model recommendations missing
// the required "What would change my answer:" section.
//
// Wired in .claude/settings.json under hooks.Stop.
// Returns decision:block to ask Claude to re-generate with the correction.
// Skips when stop_hook_active = true to avoid infinite loops.
// Fails open on any internal error (logs but does not block).

const fs = require('fs');
const path = require('path');

let raw = '';
process.stdin.on('data', (chunk) => { raw += chunk; });
process.stdin.on('end', () => {
  try { run(JSON.parse(raw || '{}')); }
  catch (err) { logError(err); process.exit(0); }
});

function run(input) {
  if (input.stop_hook_active) { process.exit(0); return; }

  const transcriptPath = input.transcript_path;
  if (!transcriptPath || !fs.existsSync(transcriptPath)) { process.exit(0); return; }

  const lines = fs.readFileSync(transcriptPath, 'utf8').trim().split('\n');
  const messages = lines.map(safeParse).filter(Boolean);

  const pair = findLastUserAssistantPair(messages);
  if (!pair) { process.exit(0); return; }

  const userText = extractText(pair.user).toLowerCase();
  const assistantText = extractText(pair.assistant);
  const assistantLower = assistantText.toLowerCase();

  if (!isToolModelContext(userText, assistantLower)) { process.exit(0); return; }

  // Check 1: fold without evidence.
  const foldHit = STRONG_FOLD_PATTERNS.find((re) => re.test(assistantLower));
  const userPushbackHit = USER_PUSHBACK_PATTERNS.find((re) => re.test(userText));
  const userHasEvidence = USER_EVIDENCE_PATTERNS.some((re) => re.test(userText));
  const assistantHasAuditTrail = ASSISTANT_AUDIT_PATTERNS.some((re) => re.test(assistantLower));

  if (foldHit && userPushbackHit && !userHasEvidence && !assistantHasAuditTrail) {
    log({ kind: 'fold', userPushbackHit: String(userPushbackHit), foldHit: String(foldHit) });
    block(buildFoldMessage(foldHit, userPushbackHit));
    return;
  }

  // Check 2: WWCMM section required on explicit recommendations.
  const isExplicitRec = EXPLICIT_RECOMMENDATION_PATTERNS.some((re) => re.test(assistantLower));
  if (isExplicitRec) {
    const hasWwcmm = WWCMM_PATTERNS.some((re) => re.test(assistantLower));
    if (!hasWwcmm) {
      log({ kind: 'wwcmm_missing' });
      block(buildWwcmmMessage());
      return;
    }
  }

  process.exit(0);
}

// --- Pattern banks ---

const TOOL_MODEL_KEYWORDS = /(best|which|what.{0,30}(model|tool|framework|stack|option|library|service|platform|api|provider)|recommend|use\s+for|should i (use|pick|choose))/i;
const ASSISTANT_DECISION_MARKERS = /(load.?bearing criteria|i'?d (pick|recommend|choose|go with)|the (best|right) (model|tool|option|choice) (is|would be)|my recommendation)/i;

function isToolModelContext(userText, assistantLower) {
  return TOOL_MODEL_KEYWORDS.test(userText) || ASSISTANT_DECISION_MARKERS.test(assistantLower);
}

// Strong-fold patterns: tight phrasing that almost only shows up in actual reversals.
const STRONG_FOLD_PATTERNS = [
  /you'?re right,?\s+(let me update|i'?ll|that'?s a better)/,
  /you'?re right,?\s+\w+ is (better|the best)/,
  /good (point|catch),?\s+(let me|i'?ll|switching|updating)/,
  /let me update.{0,20}(to|recommendation)/,
  /switching (to|my recommendation to)/,
  /(updated|revised) recommendation:?\s+\w+/,
  /i'?ll (switch|change|update) (to|my recommendation)/,
  /actually,?\s+\w+ is (better|the best|the right)/,
  /ok(ay)?,?\s+(yes|you'?re right).{0,30}(better|right)/,
];

// User pushback: user named or implied an alternative without supplying evidence.
const USER_PUSHBACK_PATTERNS = [
  /i (heard|think|feel|read) .{0,80}(better|works|use|win)/,
  /isn'?t .{0,40} better/,
  /what about .{0,40} instead/,
  /actually .{0,40} is (better|the best)/,
  /\w+ is (way )?better than/,
  /shouldn'?t (it|we) (be|use) /,
  /i prefer /,
  /(but|wait),?\s+\w+ is (better|the best)/,
];

// Evidence in user message (if present, pushback is grounded; don't block).
const USER_EVIDENCE_PATTERNS = [
  /\bbenchmark/,
  /\btested?\b/,
  /\bmeasured\b/,
  /artificial analysis|lm arena|lmarena/,
  /https?:\/\//,
  /\b(study|paper|whitepaper|article)\b/,
  /\b(ran|tried|used) it (for|on)/,
  /\b\d+(\.\d+)?\s*%/, // numeric data point
];

// Audit trail in assistant response (if present, fold may be evidence-driven; don't block).
const ASSISTANT_AUDIT_PATTERNS = [
  /load.?bearing criteria/,
  /checking? against the criteria/,
  /new technical evidence/,
  /defending my (answer|original|recommendation)/,
  /sticking with/,
  /benchmark.{0,30}(shows|indicates|confirms)/,
  /(verified|confirmed) via (websearch|search|benchmark)/,
];

// Explicit recommendation markers that trigger WWCMM requirement.
const EXPLICIT_RECOMMENDATION_PATTERNS = [
  /\bi'?d (pick|recommend|choose|go with)\b/,
  /\bmy recommendation:?\s+\w+/,
  /\bthe (best|right) (model|tool|option|choice|framework|stack)\s+(is|for .{0,30} is)\s+\w+/,
  /\buse\s+\w+\s+(for this|here|because)/,
  /\blocked-?in answer:/,
];

const WWCMM_PATTERNS = [
  /what would change my (answer|mind|recommendation)/i,
  /what would flip (my|the) answer/i,
  /falsification criteria/i,
  /this answer changes if/i,
];

// --- Helpers ---

function findLastUserAssistantPair(messages) {
  let lastAssistant = -1;
  let lastUser = -1;
  for (let i = messages.length - 1; i >= 0; i--) {
    const role = messages[i].type;
    if (lastAssistant === -1 && role === 'assistant') { lastAssistant = i; continue; }
    if (lastAssistant !== -1 && role === 'user') { lastUser = i; break; }
  }
  if (lastAssistant === -1 || lastUser === -1) return null;
  return { user: messages[lastUser], assistant: messages[lastAssistant] };
}

function extractText(msg) {
  const content = msg && msg.message && msg.message.content;
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content.filter((c) => c && c.type === 'text').map((c) => c.text || '').join('\n');
  }
  return '';
}

function safeParse(line) {
  try { return JSON.parse(line); } catch { return null; }
}

function block(reason) {
  process.stdout.write(JSON.stringify({ decision: 'block', reason }));
  process.exit(0);
}

function buildFoldMessage(foldHit, userPushbackHit) {
  return [
    'RULE 27 + RULE 20 VIOLATION: Possible position reversal without new technical evidence.',
    '',
    `Fold pattern matched: ${foldHit}`,
    `User-pushback pattern matched: ${userPushbackHit}`,
    '',
    'Re-check before re-issuing the response:',
    '1. Did the user provide NEW TECHNICAL EVIDENCE (benchmark, test result, citation, real-world data)?',
    '2. Did you check the named alternative against the LOAD-BEARING CRITERIA you defined?',
    '3. Does the alternative win on a load-bearing criterion or only on a tertiary one?',
    '',
    'If NO to any: DEFEND your original answer. Use the Rule 27 phrasing:',
    '   "Let me check [option] against the load-bearing criteria: [list]. Updating only if it wins on those."',
    '',
    'If YES: Update, but show the evidence chain explicitly (cite the benchmark / source / new constraint).',
    '',
    'Also REQUIRED: include a "What would change my answer:" section with 2-3 falsification criteria. See Rule 28.',
    '',
    'Re-generate the response.',
  ].join('\n');
}

function buildWwcmmMessage() {
  return [
    'RULE 28 VIOLATION: Tool/model recommendation missing "What would change my answer:" section.',
    '',
    'Add the section before finalizing. Format:',
    '',
    'What would change my answer:',
    '- A benchmark showing X beats Y on [load-bearing criterion]',
    '- A use-case constraint that shifts which criterion is load-bearing',
    '- A new model release within the last 30 days that changes the SOTA',
    '',
    'This pre-commits you to falsification criteria so future pushback can only flip the answer with real evidence, not by the user naming a different option.',
    '',
    'Re-generate the response with this section included.',
  ].join('\n');
}

function log(record) {
  try {
    const dir = path.join(projectDir(), '.context', 'anti-fold-log');
    fs.mkdirSync(dir, { recursive: true });
    const today = new Date().toISOString().slice(0, 10);
    const file = path.join(dir, `${today}.jsonl`);
    const line = JSON.stringify({ ts: new Date().toISOString(), ...record }) + '\n';
    fs.appendFileSync(file, line);
  } catch (_) { /* best effort */ }
}

function logError(err) {
  try {
    const dir = path.join(projectDir(), '.context', 'anti-fold-log');
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, 'errors.log');
    fs.appendFileSync(file, `[${new Date().toISOString()}] ${err.stack || err.message}\n`);
  } catch (_) { /* best effort */ }
}

function projectDir() {
  // Resolve the repo root: env var when the hook runs under Claude Code,
  // otherwise two levels up from this file (.claude/hooks/ -> repo root).
  return process.env.CLAUDE_PROJECT_DIR || path.resolve(__dirname, '..', '..');
}
