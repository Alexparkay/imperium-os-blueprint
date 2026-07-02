---
title: "OPTIONAL MODULE: Telegram MCP Sync Runs On-Demand, Not on Schedule"
type: rule
status: optional
created: 2026-06-11
---

# OPTIONAL MODULE: Telegram MCP Sync Runs On-Demand, Not on Schedule

**This rule only applies if the Telegram MCP module is installed** (onboarding Phase 4, optional connector). If it is not installed, tell the owner it's an optional module.

Scheduled sync tasks spawn visible terminal popups and waste cycles. The pattern this OS uses: sync on demand, query the local DB.

## Architecture (generic pattern)

- **Sync script:** `~/.claude-tools/telegram-mcp/index.js` - pulls latest dialogs + messages from Telegram via GramJS into local SQLite, then exits.
- **MCP server:** `~/.claude-tools/telegram-mcp/mcp-server.cjs` - read-only server queried on demand. Always works regardless of sync freshness.
- **Local DB:** `~/.claude-tools/telegram-mcp/data/telegram.db`

## When to run the sync

Before answering ANY Telegram-related query, run the sync first:

```bash
node ~/.claude-tools/telegram-mcp/index.js > /dev/null 2>&1
```

Triggers (any of these phrases or intent):

- "check Telegram", "find X in Telegram"
- "what did [person] say on Telegram"
- "latest Telegram messages"
- Any Telegram MCP tool call where the local DB might be stale (>24h since `sync_meta.last_sync`)

## Skip sync if recently fresh

Before running the full sync, check `sync_meta.last_sync` in the DB. If <30 minutes old, skip; the existing data is fresh enough.

## Sub-agent instructions

When spawning sub-agents that touch Telegram data, include:
"Before any Telegram query, run `node ~/.claude-tools/telegram-mcp/index.js > /dev/null 2>&1` to refresh the local DB. Don't skip this; the DB is on-demand sync only."
