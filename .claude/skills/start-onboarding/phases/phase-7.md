# Phase 7 - Health baseline + graduation

**Goal:** a measured starting point, a week-one plan, and a clean handoff to daily use.

## 1. Run the health check

Use the `project-health` skill to score the Four C's (Context, Connections, Capabilities, Cadence) out of 10 each. Show the scores with one line per C, and frame low scores correctly: "Day-one scores are supposed to be low. We re-check weekly and watch them climb."

**The real-operator gate (hard rule, no exceptions):** if the state file's `real_operator` status is `pending`, **Context is capped at 7/10**, whatever the other evidence says. The system has been configured around someone who has never said a word to it; that is a real context gap, and the score must say so. Report it plainly: "Context: 7/10, capped - [name] runs this chat day to day and hasn't been onboarded yet. A 20-minute session with [name] lifts the cap. Say 'onboard [name]' whenever they're free." Remove the cap only when the operator sub-onboarding (below) is done and the status flips to `onboarded`.

Save the baseline as a dated entry in `memory/system_changelog.md` - this is the changelog's FIRST entry, the moment the system went live. Include: date, seat (role + department), org mode, the Four C scores (note the cap if applied), connectors connected, packs installed, skills built. No privacy-list items, ever.

## 2. Run the lint

`node scripts/os-lint.js`. Fix anything trivial it finds (dead paths, missing frontmatter) yourself, silently. Summarize: "System check passed" or "System check found [N] small things; I fixed [N] and noted the rest."

## 3. Write the week-one plan

5 bullets, personalized from everything above, into `memory/kanban.md`, and show it. Pattern: use each first skill once on a real task, tell the system one thing to remember each day, read one output critically and correct its voice, finish any deferred connector, and re-run the health check in 7 days. If the operator sub-onboarding is pending, it replaces the weakest bullet - it is the single highest-value item on the list.

## 4. First-seat reminder (org-first-seat installs only)

If `org_mode` is `org-first-seat`: remind them, in two sentences, that when the next seat arrives, the install team pre-loads the company truth in `context/org/` onto every seat and the built-in company workspace keeps team knowledge flowing between them - a short install-team job, nothing for them to set up. Add it to "Notes for next session" in the state file so it can't be forgotten.

## 5. Graduation message

Cover, in your own warm words:

- Onboarding is done; from now on, just talk to it like a sharp colleague.
- Brain dumps welcome, any length, any mess.
- Corrections make it permanently smarter: "don't do X", "remember Y", "that doesn't sound like me" all stick.
- **If you can't see something or don't know if it exists, just ask in the chat. It can see everything in here.**
- Where things live: progress page in `docs/`, connector menu at `docs/connectors/INDEX.md`, the 5-minute refresher at `docs/START-HERE.md`, the visual map of the whole system at `docs/system-map.html`.

## 6. Final updates

State file: `status: complete`, `current_phase: 7`, all phases done (the pending operator item stays open - it outlives onboarding). Status page: all phases done, overall 100%, `<body data-complete="true">`, current focus set to "Setup complete. The system is live." (append " One thing open: [operator name]'s 20-minute onboarding." if pending). Offer to open it one last time.

**Exit criteria:** baseline recorded as the first changelog entry, real-operator gate applied if due, lint run, week-one plan on the kanban, state marked complete, status page at 100%.

---

## The operator sub-onboarding (run when they say "onboard [name]")

A 20-minute session with the daily operator named in Phase 1. Same tone rules as everything else. It is a slim pass over three phases, for a new person, in an already-configured system:

1. **Identity-lite:** their name, how they like to be addressed, anything for the privacy list. Add them to `memory/people.md` and to the "The real operator" section of `context/seat.md` (confirm what Phase 1 recorded about their role).
2. **Voice:** run the Phase 3 flow for THEM (2-3 samples → their own voice profile at `content-pipeline/voice-profile/operator-<name>/`, live test). Drafts "from the seat" keep using the seat holder's voice profile; drafts the operator sends as themselves use theirs.
3. **Their view of the seat:** two questions - "What do you handle without asking [seat holder]?" and "What always goes to [seat holder] first?" Reconcile the answers with the approval boundary in `context/seat.md`; where they disagree, the seat holder's version stands and the difference is flagged to them in one line.

Close: set `real_operator` status to `onboarded` in the state file, resolve the pending item, remove the Context cap at the next health check, and tell both people it's done.
