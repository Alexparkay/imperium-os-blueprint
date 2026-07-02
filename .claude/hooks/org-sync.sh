#!/bin/bash
# SessionStart hook - refresh the context/org/ mirror from the org context repo.
# Only acts when ORG_CONTEXT_REPO is configured (org mode); silent no-op otherwise.
# A failed sync must NEVER block a session: always exit 0, note the problem on stderr.

DIR="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"

# Configured? Check process env first, then the root .env (uncommented, non-empty value).
CONFIGURED="${ORG_CONTEXT_REPO}"
if [ -z "$CONFIGURED" ] && [ -f "$DIR/.env" ]; then
  CONFIGURED=$(grep -E '^[[:space:]]*ORG_CONTEXT_REPO[[:space:]]*=[[:space:]]*[^[:space:]]+' "$DIR/.env" 2>/dev/null | head -1)
fi
[ -z "$CONFIGURED" ] && exit 0  # single-seat mode: nothing to do, say nothing

# Org mode: sync with a 10s cap so a dead network can't stall session start.
if command -v timeout >/dev/null 2>&1; then
  OUT=$(timeout 10 node "$DIR/scripts/org-sync.js" 2>&1)
else
  OUT=$(node "$DIR/scripts/org-sync.js" 2>&1)
fi
STATUS=$?

if [ $STATUS -eq 0 ]; then
  echo "$OUT" | tail -1   # one line of context: what was synced
else
  echo "org-sync hook: sync did not complete (continuing without a refresh - context/org/ may be stale). Detail: $(echo "$OUT" | head -3 | tr '\n' ' ')" >&2
fi

exit 0
