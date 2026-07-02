#!/bin/bash
# UserPromptSubmit hook - flags brain dumps for router processing
# Injects a reminder into context when input looks like a brain dump
# Exit 0 = continue; stdout is injected as additional context

INPUT=$(cat)

# Extract prompt text (fallback to raw input if jq not available)
if command -v jq >/dev/null 2>&1; then
  PROMPT=$(echo "$INPUT" | jq -r '.prompt // .user_message // empty' 2>/dev/null)
else
  PROMPT="$INPUT"
fi

# Count words
WORDS=$(echo "$PROMPT" | wc -w | tr -d ' ')

# Skip conditions
# 1. Short inputs (< 50 words)
if [ "$WORDS" -lt 50 ]; then exit 0; fi

# 2. Explicit slash commands
if echo "$PROMPT" | head -1 | grep -q "^/"; then exit 0; fi

# 3. System-generated messages
if echo "$PROMPT" | head -1 | grep -qi "^system-reminder\|^tool loaded\|^<system"; then exit 0; fi

# Brain dump signal detection (any of these = strong signal)
SIGNALS=0
if echo "$PROMPT" | grep -qi "^so \|^basically \|^yeah \|^i was thinking\|^i want\|^i need"; then SIGNALS=$((SIGNALS+1)); fi
if [ "$WORDS" -gt 80 ]; then SIGNALS=$((SIGNALS+1)); fi
if echo "$PROMPT" | grep -q "\. .* \. .* \. "; then SIGNALS=$((SIGNALS+1)); fi  # multiple sentences
if echo "$PROMPT" | grep -qi " and also \| and then \| but then \| oh and \| one more thing"; then SIGNALS=$((SIGNALS+1)); fi

# If 1+ signals, inject router reminder
if [ "$SIGNALS" -ge 1 ]; then
cat <<'EOF'
[braindump-router] This input qualifies as a brain dump. Before responding:

1. Invoke the braindump-router skill: .claude/skills/braindump-router/SKILL.md
2. Run the 5-step pipeline internally: Clean -> Extract -> Route -> Score -> Act
3. Apply .claude/skills/wispr-corrections/SKILL.md to fix voice-transcription errors
4. Execute per confidence tier (HIGH=silent, MEDIUM=preface, LOW=one question)
5. Write audit log to .context/braindump/YYYY-MM-DD-HHMM.md
6. Follow rule 17 (concise chat: bullets, not paragraphs) for owner-facing output

ENFORCEMENT GATES (before Step 5 Act):

7. RULE 19 - Empirical claim check: scan your planned response for any claim about
   platform behavior, algorithm, audience data, engagement benchmarks, tool capabilities,
   market trends, or anything that could have moved in the last 30 days. For each such
   claim, VERIFY VIA WEBSEARCH in this session before writing it. No "training data says",
   no "skill file says" (skill files get stale). If you cannot verify, do NOT state the
   claim. See .claude/rules/19-research-empirical-claims.md.

8. RULE 20 - Contrarian pre-check: if the owner proposed a strategy, tactic, plan, or
   framing, run the contrarian pre-check internally BEFORE agreeing: (a) argue the
   opposite for 30 seconds, (b) find the weakest assumption, (c) surface at least one
   real counter-case. If the pre-check produces real counter-arguments, include them
   BEFORE any agreement. Default stance = adversarial. Never open with "good question".
   Never reverse position on displeasure alone, only on new evidence.
   See .claude/rules/20-contrarian-default.md.

Do NOT respond from pattern-match alone. Run the router first.
EOF
fi

exit 0
