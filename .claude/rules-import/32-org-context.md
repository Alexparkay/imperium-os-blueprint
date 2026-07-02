---
title: "MANDATORY: In Org Mode, context/org/ Is Read-Only For This Seat"
type: rule
status: active
created: 2026-07-02
---

# MANDATORY: In Org Mode, context/org/ Is Read-Only For This Seat

Applies when org mode is active: `ORG_CONTEXT_REPO` is set in the root `.env` and `context/org/` mirrors the company's org context repo (`node scripts/org-sync.js --status` tells you which mode you're in). In single-seat mode this rule is dormant: `context/org/` is locally owned and edited normally.

## Rules

1. **Never edit, create, or delete files in `context/org/` directly.** The directory is a read-only mirror; a local edit desyncs this seat from every other seat and blocks the next sync (the sync guard detects modified files and aborts rather than clobbering them).
2. **Proposed changes go through `memory/org-proposals/`.** Wrong or missing org truth → write `memory/org-proposals/YYYY-MM-DD-<slug>.md` with a diff-style block (format: `memory/org-proposals/README.md`), then tell the owner it needs the org admin. `node scripts/org-sync.js --propose <file>` validates the file.
3. **Unconfirmed company facts are stored as "verify with [org admin]".** When the operator states something that contradicts or extends org truth (a price change, a new hire, a dropped offer), do NOT treat it as fact: record it in the relevant `memory/` file tagged `verify with [org admin]`, and offer to draft the proposal. Org truth changes when the org repo changes, not when someone says so in a chat.
4. **Never present org truth as seat-editable.** If the operator asks to "update the company one-liner" or similar, explain the propose-upward flow in one line and draft the proposal - don't silently edit the mirror, and don't refuse without offering the path.
5. **Seat truth stays out of org files.** Anything specific to this seat (its operator, approval boundary, KPIs, stakeholders) belongs in `context/seat.md`, which is local and always editable.

## Sub-agents

When spawning sub-agents that touch `context/`, include in their prompt: "context/org/ is a read-only mirror in org mode - never write there; proposed org-truth changes go to memory/org-proposals/."

## Recovery

If `context/org/` was edited by mistake: save the intended change as a proposal, restore the mirror (`git checkout -- context/org/`), re-run `node scripts/org-sync.js`.
