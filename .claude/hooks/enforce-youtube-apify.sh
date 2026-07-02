#!/bin/bash
# PreToolUse hook for Agent tool - blocks sub-agents doing YouTube work without Apify instruction
# Exit 0 = allow, Exit 2 = block with feedback

INPUT=$(cat)

# Check if the agent prompt mentions YouTube but doesn't mention transcripts.js/apify
if echo "$INPUT" | grep -qi "youtube\|youtu\.be"; then
  if ! echo "$INPUT" | grep -qi "transcripts\.js\|apify"; then
    echo "BLOCKED: YouTube task detected but no Apify transcript instruction in the agent prompt." >&2
    echo "You MUST include this in the agent prompt:" >&2
    echo "  'Use: cd \$CLAUDE_PROJECT_DIR/automations/youtube && node transcripts.js \"<url>\"'" >&2
    echo "  'Do NOT use WebFetch for YouTube URLs.'" >&2
    exit 2
  fi
fi

exit 0
