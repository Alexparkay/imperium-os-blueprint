---
name: ops
description: The operations department starter pack. Four thin, useful-on-day-one skills - meeting notes into owner-assigned actions on the kanban, described processes into stepped SOP docs, a vendor register with renewal/contact tracking, and a weekly ops pulse over open actions and overdue follow-ups. Install for any seat that runs the machine rather than the message.
skills:
  - meeting-notes-to-actions
  - process-health
  - sop-writer
  - vendor-tracker
connectors:
  - none required - all four skills run on the base memory system (a calendar connection makes renewal reminders richer but is optional)
rules_import: []
memory: []
templates: []
onboarding: onboarding.md
---

# Ops pack

Operations is follow-through: what was agreed, who owns it, is it moving, and is anything about to lapse. These four skills cover that loop end to end - capture (meeting-notes-to-actions), codify (sop-writer), track (vendor-tracker), and pulse (process-health). All of them write into the base memory system (`memory/kanban.md`, `memory/business/`, `memory/vendors.md`), so nothing here needs a new tool.

Install: `node scripts/install-pack.js ops` · Questions the install asks: `onboarding.md`

## Routing rows

Appended verbatim to `.claude/reference/skills-routing-index.md` on install; removed on uninstall.

| `meeting-notes-to-actions` | Turn a meeting transcript or raw notes into an owner-assigned, deadline-dated action list and land it on the kanban. Trigger on "process these meeting notes", "actions from this meeting", "what did we agree", "extract action items", or any pasted transcript/notes from a call or meeting |
| `process-health` | Weekly ops pulse: open actions by owner, stuck items, overdue follow-ups, lapsing vendor renewals - one screen, worst first. Trigger on "ops pulse", "process health", "what's stuck", "overdue actions", "how are we tracking", "weekly ops review" |
| `sop-writer` | Turn a described process into a stepped, owner-and-trigger-explicit SOP doc in memory/business/sops/. Trigger on "write an SOP", "document this process", "standard operating procedure", "how-to for the team", "turn this into a checklist", or any walkthrough of how a recurring task gets done |
| `vendor-tracker` | Maintain the vendor register: suppliers, contacts, costs, renewal dates, notice periods, in memory/vendors.md. Trigger on "add a vendor", "vendor list", "when does [vendor] renew", "what are we paying for", "cancel [vendor]", "who's our contact at [vendor]", or any supplier/subscription/renewal question |
<!-- ROUTING_ROWS -->
