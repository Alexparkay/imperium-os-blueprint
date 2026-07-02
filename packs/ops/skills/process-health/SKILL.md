---
name: process-health
description: "Weekly operations pulse - one screen showing where the machine is slipping: open actions by owner, stuck items, overdue follow-ups, unassigned work, lapsing vendor renewals, and stale SOPs. Trigger on 'ops pulse', 'process health', 'weekly ops review', 'what's stuck', 'what's overdue', 'how are we tracking', 'anything slipping', or as the operations arm of a weekly review. This is the operations-scoped sibling of the base project-health skill: project-health audits the SYSTEM (files, automations, Four C's); process-health audits the WORK (actions, follow-ups, renewals, SOPs)."
metadata:
  title: Process Health
  type: skill
  status: active
  created: 2026-07-02
---

# Process Health

Operations fails quietly: an action nobody owns, a follow-up two weeks cold, a renewal that fires unwatched. This skill reads what the other ops skills have been writing and surfaces the slippage on one screen, worst first, each item with a proposed next move - a pulse to act from, not a report to admire.

## When to use

- Weekly, as the ops arm of any review cadence
- "What's stuck?" / "anything slipping?" / "how are we tracking?"
- Before a team meeting or a planning session (walk in knowing where the fires are)
- After a heavy week of meetings (lots of meeting-notes-to-actions output = lots of new commitments to check)

## When NOT to use

- System/infrastructure audits (files, automations, connectors, Four C's) - that's the base `project-health` skill
- Single-item status checks ("did X get done?") - read the kanban directly
- Daily - a pulse run daily becomes noise and gets skipped; weekly is the design cadence

## The pipeline

1. **Gather** (read-only pass, skip sources that don't exist yet and say so in one line):
   - `memory/kanban.md` - open actions, owners, due dates, `UNASSIGNED` items, open-questions blocks
   - `memory/calendar.md` - deadlines and last-safe-cancel dates within 14 days, and anything already past
   - `memory/vendors.md` - `watch`/`cancelling` rows and renewals inside their notice window
   - `memory/business/sops/README.md` - SOPs with last-verified older than 90 days
   - git log (last 7 days) on `memory/` - what actually moved this week
2. **Classify each open item:**
   - **OVERDUE** - past its date
   - **STUCK** - no date but no movement in 14+ days (use git history of the kanban as the movement signal)
   - **UNASSIGNED** - no owner (these outrank everything; unowned work does not happen)
   - **LAPSING** - renewal/notice/deadline inside the next 14 days
   - **MOVING** - fine; counted, not listed
3. **Render the pulse** - ONE SCREEN, worst first:
   ```
   OPS PULSE - YYYY-MM-DD
   UNASSIGNED (N): item · since when · proposed owner
   OVERDUE   (N): item · owner · days over · proposed next move
   STUCK     (N): item · owner · days idle · proposed unblock
   LAPSING   (N): item · date · what happens if ignored
   Moving: N items on track · Done this week: N
   ```
   Every listed item carries a proposed next move. A pulse that only describes problems is half a skill.
4. **Offer the actions, don't take them.** "Want me to: reassign the 2 unassigned items, bump the 3 overdue owners, calendar the lapsing renewal decision?" Execute on approval: kanban edits, calendar entries, drafted nudge messages (drafts only - nothing sends itself).
5. **Trend line.** Append one line to `memory/business/ops-pulse-log.md` (create if missing): `YYYY-MM-DD · unassigned N · overdue N · stuck N · lapsing N · done-this-week N`. Three weeks of rising overdue is a process problem, not a discipline problem - say so when the trend shows it, and propose which SOP or threshold needs changing.

## Hard rules

- **One screen.** Overflow goes to a linked detail file (`.context/ops-pulse/YYYY-MM-DD.md`), never onto the pulse.
- **Worst first, always.** UNASSIGNED before OVERDUE before STUCK before LAPSING.
- **Read-only until approved.** The pulse proposes; the owner disposes.
- **No shame framing.** The pulse reports state, not character. "3 overdue" not "you've been ignoring".

## Self-evaluation

| Dimension | Score | Notes |
|-----------|-------|-------|
| Completeness | 9/10 | Covers actions, follow-ups, renewals, SOP staleness, plus trend memory |
| Actionability | 9/10 | Fixed render format, every item carries a proposed move, approval-gated execution |
| Specificity | 8/10 | STUCK threshold (14d idle) is a chosen default; tune per business after a month of pulses |
| Integration | 9/10 | Pure consumer of what meeting-notes-to-actions, vendor-tracker, and sop-writer maintain |
| Overhead | 9/10 | Read-only gather, weekly cadence, one log line of state |
| **Average** | **8.8/10** | |

---

## Related

- [[meeting-notes-to-actions]] · [[vendor-tracker]] · [[sop-writer]]
- `project-health` (base sibling: system audit, not work audit)
- `memory/kanban.md` · `memory/calendar.md`
