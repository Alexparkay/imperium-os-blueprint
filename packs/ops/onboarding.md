---
title: Ops pack - onboarding questions
type: onboarding-branch
pack: ops
---

# Installing the ops pack: what to ask

Asked by onboarding Phase 5 (or any later session) when this pack is installed. One question at a time. Record answers in `memory/onboarding-state.md` under a `## Pack: ops` heading, and route them to the files named below.

1. **"Where do decisions and commitments actually get made in your week - recurring meetings, ad-hoc calls, chat threads? Name the recurring ones."**
   → The meeting map. Recurring meetings become the natural inputs for `meeting-notes-to-actions`; note them so the skill can ask "want me to process the [meeting] notes?" when they mention one.

2. **"Which 2 or 3 processes live only in someone's head today - the ones that would break if that person took two weeks off?"**
   → The SOP backlog: write each as a kanban item ("SOP: <process>") so `sop-writer` has a queue. Don't write the SOPs now; capture the list.

3. **"Roughly how many paid tools, subscriptions, and suppliers does the business run on? Want me to build the vendor register now from what you can name off the top of your head?"**
   → If yes: seed `memory/vendors.md` from their list (unknown costs/dates get `?`, per the vendor-tracker rules). If the finance pack is installed, offer to reconcile the register against the next finance-audit run.

4. **"When should the weekly ops pulse land - which day, and should it wait for you to ask, or is a standing weekly run worth it?"**
   → Record under `## Cadence` in the process-health skill copy in `.claude/skills/`. Default to on-demand for the first two weeks (the Phase 6 rule: schedule only proven skills).

After the answers: run ONE real pulse (`process-health`) even on a half-empty board - seeing "2 unassigned, 1 overdue" pulled from their own kanban is the moment the pack proves itself.
