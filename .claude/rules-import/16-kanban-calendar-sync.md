---
title: "MANDATORY: Keep Kanban + Calendar Updated"
type: rule
status: active
created: 2026-06-11
---

# MANDATORY: Keep Kanban + Calendar Updated

After completing ANY task, making ANY commitment, or learning about ANY deadline:

## Kanban board (`memory/kanban.md`)

**UPDATE the kanban board** by moving or adding tasks:

1. **New task/commitment:** Add to the appropriate column (This Week / This Month / Next 90 Days / In Progress)
2. **Task completed:** Move to "Done (Recent)" and mark with `[x]`. Include the date and a short outcome.
3. **Task started:** Move to "In Progress" from its planning column.
4. **Task delayed or cancelled:** Remove from kanban or add a note explaining why.

**Format:** `- [ ] Task description #tag` (define tags that match the owner's business areas, e.g. #content, #sales, #clients, #system)

## Calendar (`memory/calendar.md`)

**UPDATE the calendar** when:

1. **New date/deadline:** Add to the "Upcoming Dates" table with date, event, type, status.
2. **Event completed:** Move from "Upcoming" to "Completed" with outcome.
3. **Date changed:** Update the date in the table AND the Gantt chart if one exists.
4. **New month:** Rebuild the Gantt chart for the current month.

## When to update

- After any strategy session where the owner mentions dates, plans, or commitments
- After completing any task on the kanban board
- After any business meeting, call, or decision that changes a timeline
- When the owner says "I need to do X by Y" or "this is happening on Z"
- When content is published (move from pipeline to done)

## Three files stay in sync

- `memory/kanban.md` = what's being worked on NOW (task-level, including promises and commitments)
- `memory/calendar.md` = when things are happening (date-level)

## Sub-agent instructions

When spawning sub-agents for task-related work, include: "After completing the task, update memory/kanban.md (move task to Done) and memory/calendar.md if relevant dates changed."

## Skip for

- Routine memory updates, file moves, conversational responses
- System maintenance (git pushes, deploys) unless they complete a kanban item
