---
title: Org Context - How This Directory Works
type: explainer
status: active
---

# context/org/ - the company truth layer

This directory holds **org truth**: facts that are true for the whole company, whoever is asking. What the company is (`company.md`), what it sells (`offers.md`), what words mean (`glossary.md`), who owns which function (`departments.md`), and who works here (`people-roster.md`).

It is separate from **seat truth** (`context/seat.md`): who sits at THIS install, what they own, what they can sign off. One company, one org truth; many seats, each with its own seat file.

The directory runs in one of two modes.

## Mode 1: SINGLE-SEAT (the default)

One person, one install. These files are written locally during onboarding Phase 2, exactly as before - the interview fills them, and they are edited here whenever the business changes shape. Nothing else to set up; ignore everything below.

## Mode 2: ORG MODE (multiple seats, one company)

The buyer is a company owner; each seat is a head of department running their own install. All seats need the same company truth, so this directory stops being locally owned and becomes a **read-only mirror of a private company "org context repo"** (a small git repository the install team creates, one per company - setup guide: `docs/connectors/org-sync.md`).

The rules in org mode (enforced by `.claude/rules-import/32-org-context.md`):

- **Each seat pulls, never pushes.** `scripts/org-sync.js` refreshes this directory from the org repo (a SessionStart hook runs it automatically when `ORG_CONTEXT_REPO` is set in the root `.env`).
- **Seats never edit these files directly.** A local edit here will be flagged by the sync guard and will block the next pull until resolved.
- **Changes propose upward.** A seat that spots wrong or missing org truth writes a proposal to `memory/org-proposals/` (convention: `memory/org-proposals/README.md`). The org admin reviews and merges it into the org repo; the change reaches every seat on their next sync.

## Which mode am I in?

Run `node scripts/org-sync.js --status`. "Not configured" means single-seat; a repo URL means org mode.
