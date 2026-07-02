---
title: Connector Index
product: Imperium OS
type: connector-index
status: active
created: 2026-07-02
---

# Connector index

Every connector in the box, on one screen. Onboarding Phase 4 builds its plan from this table: the universal spine first (GitHub backup → Google Workspace), then the picks your role card recommends, filtered by where your work actually lives.

**Reading the table.** *Key needed*: whether you'll copy a key or approve a sign-in. *Effort*: `5 min` and `15 min` are guided in the chat; `build team` means it's set up with your install team, not solo mid-onboarding. Role columns: **●** start here for this seat, **○** when the work calls for it, **—** usually skip.

| Connector | What it gives you | Key needed | Effort | Owner | Marketing | Ops | Finance | Assistant |
|---|---|---|---|---|---|---|---|---|
| [Claude Code install](claude-code-install.md) | The app this whole system runs in - done before day one | no (paid plan) | 15 min | ● | ● | ● | ● | ● |
| [GitHub backup](github-backup.md) | If your laptop dies tomorrow, nothing is lost; anything can be rolled back | yes | 15 min | ● | ● | ● | ● | ● |
| [Google Workspace](google-workspace-gws.md) | Calendar, Docs, Drive, Gmail: "what does my week look like" just works | yes | 15 min | ● | ● | ● | ● | ● |
| [YouTube research](apify-youtube.md) | Paste any video link; the whole transcript is read before your coffee | yes | 5 min | ○ | ● | — | — | ○ |
| [Telegram notifications](telegram-notify.md) | Finished work finds your phone, wherever you are | yes | 15 min | ● | ● | ● | ○ | ● |
| [Dropbox media](dropbox-rclone.md) | Your big media library, searched and streamed, never downloaded | yes | 15 min | ○ | ● | — | — | — |
| [MCP servers](mcp-servers.md) | Plug-in abilities added as real needs show up | varies | 15 min | ○ | ○ | ○ | ○ | ○ |
| [WhatsApp](whatsapp-mcp.md) | Search your chats: what was said, promised, and sent, without scrolling | no (QR pairing) | build team | ○ | — | ○ | — | ○ |
| [Image studio](higgsfield.md) | Professional AI images of you, for face-forward content | yes | 15 min | ○ | ○ | — | — | — |
| [Org sync](org-sync.md) | One shared company truth across every seat - no drift between installs | no | build team | ● (multi-seat) | joins ready-made | joins ready-made | joins ready-made | joins ready-made |
| [Company Brain](company-brain.md) | A live database under the operation: the data your dashboards will read | yes | build team | ○ | ○ | ○ | ○ | — |
| [Worker](worker.md) | The engine that runs between conversations: pipes in, routine out | yes | build team | ○ | ○ | ○ | — | — |

Missing something? [Connectors we don't have yet](not-yet.md) lists the most-requested gaps (social analytics, CRM feeds, accounting pipes) with honest workarounds that get you most of the value today.

## Maintainer note

Adding a connector is five edits, always together: the guide in this folder, a row in this table, a row in the state-file template (`.claude/skills/start-onboarding/SKILL.md`), a card on `docs/setup-status.html`, and a mention in the right role cards (`.claude/skills/start-onboarding/roles/`).

**Exception - install-team tier and preconditions.** `org-sync`, `company-brain`, `worker` (build-team effort) and `claude-code-install` (a precondition of using the product, not a guided step) get the guide + the row in this table only: no state-file row, no status-page card. Phase 4 names them when relevant and records interest under the state file's "Pending items" section; the connector table and status cards track only the connectors onboarding guides directly.
