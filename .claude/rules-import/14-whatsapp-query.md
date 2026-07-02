---
title: "OPTIONAL MODULE: WhatsApp Query Rules (whatsmeow MCP)"
type: rule
status: optional
created: 2026-06-11
---

# OPTIONAL MODULE: WhatsApp Query Rules (lharries / whatsmeow MCP)

**This rule only applies if the WhatsApp MCP module is installed** (onboarding Phase 4, optional connector; guide: `docs/connectors/whatsapp-mcp.md`). If it is not installed, tell the owner it's an optional module and point at the guide.

When querying the owner's WhatsApp messages, contacts, or chats, use the **lharries MCP tools** (no scripts, no SQL). The MCP server is wired into `.mcp.json` and exposes tools directly.

## Install location (generic pattern)

- Repo: `~/.claude-tools/whatsapp-mcp/` (cloned OUTSIDE this repo)
- Bridge: `~/.claude-tools/whatsapp-mcp/whatsapp-bridge/` (Go binary, whatsmeow)
- Server: `~/.claude-tools/whatsapp-mcp/whatsapp-mcp-server/` (Python via uv)
- Local SQLite: `~/.claude-tools/whatsapp-mcp/whatsapp-bridge/store/messages.db`

## How the bridge stays alive

The bridge is a separate process the MCP server connects to via local HTTP on `localhost:8080`. **The bridge must be running** for the MCP server to return data. Configure it to auto-start at login (Windows Task Scheduler / launchd / systemd user unit). The session persists once the QR has been scanned; re-authentication is needed roughly every ~20 days when WhatsApp expires the device (re-run the bridge in the foreground and scan the QR).

## Available MCP tools

Called directly via the `mcp__whatsapp__*` namespace. DO NOT write scripts to call them; invoke the tool.

| Tool | Use |
|---|---|
| `search_contacts` | Find a contact by name or phone number |
| `list_messages` | Retrieve messages with filters (chat, sender, date range, search term) |
| `list_chats` | All chats sortable by activity or name, filterable, paginated |
| `get_chat` | Metadata for a specific chat (group or DM) by JID |
| `get_direct_chat_by_contact` | Find the DM chat for a specific contact |
| `get_contact_chats` | All chats (DMs + groups) a contact participates in |
| `get_last_interaction` | Latest message exchanged with a contact |
| `get_message_context` | Surrounding messages around a specific message ID |
| `send_message` | Send text to a JID (USE SPARINGLY; the stance is read-only by default) |
| `send_file` | Send a file (image, video, document) |
| `send_audio_message` | Send a voice note (requires local ffmpeg for opus conversion) |
| `download_media` | Download media from a received message |

## HARD RULES

1. **NEVER write SQL queries against the SQLite DB directly.** Use the MCP tools. The bridge keeps the DB consistent; direct writes corrupt state.
2. **DEFAULT to read-only operations.** Sending via MCP is for known recipients only, never bulk, never outreach.
3. **The bridge can return LIDs (`@lid`) instead of phone numbers for unknown group participants.** This is a WhatsApp privacy feature, not a bug. Saved contacts resolve fine; unsaved group members may show as `@lid`. Remediation: save the contact on the phone, wait ~5 min for sync, re-query.
4. **When the user references a contact by first name**, use `search_contacts` first to resolve. Don't guess JIDs.
5. **For "find [person] from last week"**, combine `search_contacts` (resolve the person) + `list_messages` (filter by chat + date range).
6. **For country-prefix queries**, use `list_chats` or `search_contacts` and filter by phone prefix client-side.
7. **For group membership**, use `get_chat` on the group JID; it returns the participant list.
8. **Categorization / tagging** is NOT a built-in primitive. Build it on top by reading messages and writing tags to a separate file (e.g., `memory/people/whatsapp-tags.json`).
