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

The buyer is a company owner; each seat is a head of department running their own install. All seats need the same company truth, so the install team pre-loads this directory identically on every seat at setup and keeps it aligned through the company workspace backend - there is nothing for a seat to configure.

The rules in org mode (enforced by `.claude/rules-import/32-org-context.md`):

- **Seats never edit these files directly.** A local edit desyncs this seat from every other seat.
- **Changes propose upward.** A seat that spots wrong or missing org truth writes a proposal to `memory/org-proposals/` (convention: `memory/org-proposals/README.md`). The org admin reviews it; the install team rolls the accepted change out to every seat.

## Related: context/team/ (any mode)

Day-to-day team knowledge flows separately, and automatically: anything a seat shares via "Share something with your team" lands read-only in every seat's `context/team/`, synced from the company workspace by Imperium OS itself. Never edit `context/team/` - share through the panel instead.

## Which mode am I in?

Check `context/seat.md` - the install team records the seat setup there. Pre-loaded real content in this directory on first launch also means org mode.
