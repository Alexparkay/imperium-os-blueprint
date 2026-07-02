#!/bin/bash
# Protect test files and sensitive files from being modified by Claude Code
# Exit 2 = block the action, stderr becomes feedback to Claude

INPUT=$(cat)
# Extract file_path from JSON input (Windows-compatible, no jq/Perl regex)
FILE_PATH=$(echo "$INPUT" | sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1)

# Skip if no file path found
if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Protected patterns - test files
TEST_PATTERNS=("test/" "tests/" "__tests__/" ".test." ".spec." ".test.ts" ".test.js" ".spec.ts" ".spec.js")

for pattern in "${TEST_PATTERNS[@]}"; do
  if [[ "$FILE_PATH" == *"$pattern"* ]]; then
    echo "BLOCKED: Cannot modify test file '$FILE_PATH'. Fix the implementation instead of changing tests." >&2
    exit 2
  fi
done

# Protected patterns - sensitive files
SENSITIVE_PATTERNS=(".env" "credentials" "secrets" ".pem" ".key")

for pattern in "${SENSITIVE_PATTERNS[@]}"; do
  if [[ "$FILE_PATH" == *"$pattern"* ]]; then
    echo "BLOCKED: Cannot modify sensitive file '$FILE_PATH'. This file may contain secrets." >&2
    exit 2
  fi
done

exit 0
