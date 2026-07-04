---
title: "MANDATORY: In Org Mode, context/org/ Is Read-Only For This Seat"
type: rule
status: active
created: 2026-07-02
---

# MANDATORY: In Org Mode, context/org/ Is Read-Only For This Seat

Applies when org mode is active: this is a multi-seat company install (the install team records it in `context/seat.md`, and `context/org/` was pre-loaded at setup so every seat holds the same company truth). In single-seat mode this rule is dormant: `context/org/` is locally owned and edited normally.

Team knowledge sharing is built into Imperium OS: contributions shared with the team land read-only in `context/team/`, synced automatically from the company workspace. `context/team/` is ALWAYS server-owned - never edit it, in any mode; new team knowledge is shared via the "Share something with your team" panel action.

## Rules

1. **Never edit, create, or delete files in `context/org/` directly (org mode) or `context/team/` (any mode).** A local edit desyncs this seat from every other seat.
2. **Proposed changes go through `memory/org-proposals/`.** Wrong or missing org truth → write `memory/org-proposals/YYYY-MM-DD-<slug>.md` with a diff-style block (format: `memory/org-proposals/README.md`), then tell the owner it needs the org admin.
3. **Unconfirmed company facts are stored as "verify with [org admin]".** When the operator states something that contradicts or extends org truth (a price change, a new hire, a dropped offer), do NOT treat it as fact: record it in the relevant `memory/` file tagged `verify with [org admin]`, and offer to draft the proposal. Org truth changes when the org admin changes it, not when someone says so in a chat.
4. **Never present org truth as seat-editable.** If the operator asks to "update the company one-liner" or similar, explain the propose-upward flow in one line and draft the proposal - don't silently edit the mirror, and don't refuse without offering the path.
5. **Seat truth stays out of org files.** Anything specific to this seat (its operator, approval boundary, KPIs, stakeholders) belongs in `context/seat.md`, which is local and always editable.

## Sub-agents

When spawning sub-agents that touch `context/`, include in their prompt: "context/org/ is read-only in org mode and context/team/ is always read-only (server-synced) - never write there; proposed org-truth changes go to memory/org-proposals/."

## Recovery

If `context/org/` or `context/team/` was edited by mistake: save the intended change as a proposal, restore the file (ask the install team if unsure), and let the built-in sync refresh `context/team/` on its own.
