---
title: Rules Index
type: index
status: active
created: 2026-06-11
---

# Rules Index - Catalog of Enforcement Rules

> **Location note:** this catalog lives in `.claude/reference/` (NOT `.claude/rules/`) on purpose - files in `.claude/rules/` auto-load into every session, and a catalog is lookup material, not always-on instruction. The always-on surface carries one pointer to it (in `00-engine-core.md`). Don't move it back.

Rules live in two physical tiers (plus deterministic hook enforcement):

- **always** - file lives in `.claude/rules/` and auto-loads every session (14 files)
- **import** - file lives in `.claude/rules-import/` and does NOT auto-load. The hard-rules list in `00-engine-core.md` carries the one-line trigger; READ the file when the trigger fires
- **hook** - deterministic enforcement wired in `.claude/settings.json`: rule 01 (PreToolUse on WebFetch + Agent), rule 08 (MCP deny list), anti-fold (Stop), braindump (UserPromptSubmit), protected files (PreToolUse on Edit/Write)

Numbering is inherited from the parent OS, so numbers are sparse. The number is an ID, not a count. Rule 00 is native to this product: it carries the engine-class instructions that used to live in CLAUDE.md (the engine/seed split - see docs/ARCHITECTURE.md, "Engine vs seed files").

| # | Rule | Tier | Trigger → read when |
|---|---|---|---|
| 00 | engine-core | always | - (hard rules, dev rules, key paths - the stable half of CLAUDE.md) |
| 01 | youtube-apify | import + hook | Any YouTube URL/task. Command is in engine-core rule 1; hooks block violations |
| 02 | subagent-context | always | - |
| 03 | memory-persistence | always | - |
| 04 | skill-routing | always | - |
| 05 | content-voice | import | Writing any content/copy for humans |
| 06 | always-push-deploy | import | End of any work session |
| 07 | media-hub-auto-save | import | After generating any media asset |
| 08 | google-workspace-gws-cli | import + hook | Any Google Docs/Sheets/Drive/Calendar/Gmail task |
| 09 | google-docs-formatting | import | Creating/formatting a Google Doc |
| 10 | quality-gate | always | - |
| 11 | anti-ai-slop | always | - |
| 12 | notify-owner | import | After completing a significant task |
| 13 | owner-privacy | always | - |
| 14 | whatsapp-query | import (OPTIONAL module) | Any WhatsApp read/send/contact task (only if module installed) |
| 15 | conversational-copy-mode | import | Writing prose/copy/emails/scripts in a warm register |
| 16 | kanban-calendar-sync | import | Task completed / commitment or deadline learned |
| 17 | concise-chat | always | - |
| 18 | braindump-first | always | - |
| 19 | research-empirical-claims | always | - |
| 20 | contrarian-default | always | - |
| 21 | no-large-local-downloads | import | Any download/fetch of media or files >500MB; rclone/wget/curl -O |
| 22 | media-storage | import | Locating or storing podcasts/footage/large media |
| 23 | telegram-on-demand-sync | import (OPTIONAL module) | Any Telegram message query (only if module installed) |
| 24 | pdf-and-markdown-links | import | Delivering any file path to the owner in chat |
| 25 | voice-calibration | import | Writing anything in the owner's voice |
| 26 | owner-likeness-generation | import (OPTIONAL module) | Any AI image/video of the owner (only if Higgsfield configured) |
| 27 | tool-recommendation-discipline | always | - |
| 28 | what-would-change-my-mind | always (hook-enforced) | - |
| 30 | excalidraw-and-artifact-links | import | Delivering Excalidraw diagrams / PDFs / contracts |
| 31 | financial-accuracy | always | - |
| 32 | org-context | import + hook | Org mode active (ORG_CONTEXT_REPO set): any write near `context/org/`, any company-truth change or unconfirmed company fact |

## Maintenance rules for this index

- A rule's file location IS its tier. If you move a rule, update this table and the hard-rules list in `00-engine-core.md` in the same commit.
- This catalog itself stays in `.claude/reference/` (see the location note at the top). Pointers to it live in `00-engine-core.md`, `.claude/CLAUDE.md`, `Home.md`, `packs/README.md`, and the scripts (`generate-registry.js`, `os-lint.js`, `install-pack.js`) - update all of them if it ever moves again.
- New rules default to **import** tier unless they must shape every single response (the bar for always-on is high).
- The 6 anti-sycophancy rules (11, 17, 19, 20, 27, 28) ship as project rules. If the owner later wants them across ALL their projects, copy them to `~/.claude/rules/` and DELETE the project copies (duplication drifts).
- `node scripts/os-lint.js` checks this table against disk and flags drift.
