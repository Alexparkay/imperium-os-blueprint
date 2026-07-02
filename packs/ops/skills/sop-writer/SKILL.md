---
name: sop-writer
description: "Turn a described process into a stepped, teachable SOP document in memory/business/sops/. Trigger on 'write an SOP', 'document this process', 'standard operating procedure', 'turn this into a checklist', 'how-to for the team', 'write down how we do X', or whenever the owner walks through how a recurring task gets done (in chat, a voice dump, or meeting notes) and that process will run again. The output is a doc a competent new hire could follow without asking questions: trigger, owner, steps with the WHY, failure points, and a done-definition."
metadata:
  title: SOP Writer
  type: skill
  status: active
  created: 2026-07-02
---

# SOP Writer

A process that lives in one person's head is a liability with a salary. This skill captures a described process while it's fresh and turns it into a document someone else could execute - which is the test: not "is it written down" but "could a competent stranger follow it".

## When to use

- The owner describes how a recurring task gets done and it isn't documented
- "Document this process" / "write an SOP for X" / "make a checklist for the team"
- After the third time the same how-do-we-do-X question appears in chat - offer the SOP proactively
- A meeting-notes pass (meeting-notes-to-actions) captured a process walkthrough worth codifying

## When NOT to use

- One-off tasks that won't recur - a checklist for a thing that happens once is overhead
- Processes the SYSTEM runs (those belong in a skill, not an SOP - offer "make this a skill" instead)
- Polished client-facing deliverables - SOPs are internal working docs; client docs go through the delivery workflow

## The pipeline

1. **Capture the walkthrough.** Take the description as given. Extract: the trigger (what starts this), the actor (who does it), the steps in order, the tools touched, and the end state.
2. **Find the holes with at most 3 questions.** The usual gaps: "What kicks this off - a date, an event, a request?" · "What does DONE look like - where does the result land?" · "Where does this usually go wrong?" Never interrogate past three; mark remaining gaps `[TBC - ask the owner]` in the doc.
3. **Draft** at `memory/business/sops/<kebab-case-name>.md`:
   - Frontmatter: title, owner (role, not just name - people leave), trigger, cadence, last-verified date
   - **Purpose** - one sentence: what this process protects or produces
   - **Steps** - numbered, verb-first, one action per step. Each step names the tool/file it touches. Add the WHY in one clause wherever a step looks skippable ("...so the invoice matches the contract" - the WHY is what stops people 'optimising' the step away).
   - **Failure points** - the 2-3 places it goes wrong, and what to do
   - **Definition of done** - the observable end state, checkable by someone else
4. **Walk it back.** Read the steps as the executor: can each step be done with ONLY the information in the doc? Fix any step that assumes head-knowledge. This pass is where SOPs earn their keep.
5. **Confirm with the owner.** Show the doc, ask what's wrong, apply fixes to the DOC (and note process improvements they mention as suggestions at the bottom, clearly separated from the current process).
6. **Register it.** Add a line to `memory/business/sops/README.md` (create on first SOP: table of SOP · owner · trigger · last-verified). If the process has a cadence, note it so process-health can check it's actually running.

## Hard rules

- **Document the process that IS, not the one that should be.** Improvement suggestions go in a clearly-marked section at the bottom, never silently merged into the steps.
- **One action per step.** "Export and reconcile and file" is three steps.
- **Owner is a role.** "The bookkeeper", not only a person's name.
- **Stale is worse than missing.** Every SOP carries last-verified; process-health flags SOPs unverified for 90+ days.

## Self-evaluation

| Dimension | Score | Notes |
|-----------|-------|-------|
| Completeness | 9/10 | Capture → gap-check → draft → walk-back → register; failure points and done-definition mandatory |
| Actionability | 9/10 | Fixed path, fixed doc skeleton, 3-question cap |
| Specificity | 8/10 | "Competent stranger" test is a judgment bar, but the walk-back step operationalises it |
| Integration | 9/10 | Lives in memory/business/, registered for process-health, hands off to skill-creation when the system should run it |
| Overhead | 9/10 | Skips non-recurring work by rule |
| **Average** | **8.8/10** | |

---

## Related

- [[process-health]]
- [[meeting-notes-to-actions]]
- `memory/business/sops/` (output home)
