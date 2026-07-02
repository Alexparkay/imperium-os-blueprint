#!/bin/bash
# PreToolUse hook for WebFetch - blocks WebFetch on YouTube URLs
# Exit 0 = allow, Exit 2 = block with feedback

INPUT=$(cat)

# Block WebFetch for YouTube URLs (check raw input for youtube patterns)
if echo "$INPUT" | grep -qi "youtube\.com\|youtu\.be"; then
  echo "BLOCKED: Do NOT use WebFetch for YouTube URLs." >&2
  echo "Use the Apify transcript extractor instead:" >&2
  echo "cd \$CLAUDE_PROJECT_DIR/automations/youtube && node transcripts.js \"<url>\"" >&2
  exit 2
fi

exit 0
