---
title: "MANDATORY: Google Workspace = gws CLI Only"
type: rule
status: active
created: 2026-06-11
---

# MANDATORY: Google Workspace = gws CLI Only

When ANY Google Workspace operation is needed (Google Docs, Sheets, Slides, Drive, Calendar, Gmail, or any other Google product):

**STEP 1 (non-negotiable):** Use the `gws` CLI tool:

```bash
gws <service> <resource> <method> --params '...' --json '...'
```

**Common commands:**

- `gws docs documents create --json '{"title": "..."}'` - Create a Google Doc
- `gws docs documents batchUpdate --params '{"documentId": "..."}' --json '...'` - Insert content into a Doc
- `gws sheets spreadsheets create --json '...'` - Create a Google Sheet
- `gws drive files list --params '{"q": "...", "supportsAllDrives": true}'` - List Drive files
- `gws drive files update --params '{"fileId": "...", "addParents": "...", "supportsAllDrives": true}'` - Move files
- `gws drive files create --upload <path> --params '{"supportsAllDrives": true}'` - Upload files
- `gws calendar events list --params '...'` - List calendar events
- `gws gmail users messages list --params '{"userId": "me"}'` - List emails

**NEVER use Google Workspace MCP tools:**

- `mcp__claude_ai_Gmail__*` - BANNED
- `mcp__claude_ai_Google_Calendar__*` - BANNED
- `mcp__claude_ai_Google_Drive__*` - BANNED
- Any `mcp__claude_ai_*` tool that touches Google services - BANNED

These are deny-listed in `.claude/settings.json` so the ban is deterministic.

**For shared drive operations (Media Hub):**

- Always pass `supportsAllDrives: true` in params
- Shared Drive ID: `{{MEDIA_HUB_DRIVE_ID}}`

**WHY:** The gws CLI is reliable, fast, and fully authenticated via OAuth (setup guide: `docs/connectors/google-workspace-gws.md`). The MCP tools are unreliable and confusing. This is a hard rule, no exceptions.

When spawning sub-agents for Google Workspace tasks, ALWAYS include this instruction:
"Use the `gws` CLI tool for all Google Workspace operations. Do NOT use any MCP tools for Google services."
