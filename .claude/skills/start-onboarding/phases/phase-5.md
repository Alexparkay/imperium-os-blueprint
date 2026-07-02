# Phase 5 - First skills + packs

**Goal:** turn 3 to 5 of their real weekly tasks into skills, and run each once for a genuine first win. The role card's department pack is the head start.

## 1. The pack offer (before building anything from scratch)

Open the role card's "First tasks + pack" section. It names ONE department pack and a one-line pitch. Make the offer in the card's words, tied to their Phase 2 task list where possible ("Three of the five tasks you named are covered by the [pack] pack - pre-built, tested, installed in one step.").

- **If yes:** run `node scripts/install-pack.js <pack>`. Then ask the pack's own setup questions from `packs/<pack>/onboarding.md` (one at a time, same tone rules). Record answers in the state file under a `## Pack: <name>` heading.
- **Walk ONE skill from the pack as the first win:** pick the pack skill closest to their named pain, run it on a live input from their business, show the output, take their reaction. Not a demo - real input, real output.
- **Record it:** add the pack to `packs_installed` in the state file (name, date, which skill got the first run) and set the pack's status-page card to `installed`.
- **If no:** record it under `packs_declined`, set the card to `declined`, and never re-pitch in the same session.
- **Multi-pack:** allowed - a seat can hold several. But recommend ONE to start; the second pack installs any day with "install the [name] pack". If a chosen task matches a skill in a DIFFERENT uninstalled pack (scan `packs/*/pack.md` manifests against `packs/installed.json`), offer that pack instead of building from scratch.

Installed pack skills count toward the 3-5 first skills; each still gets a real first run.

## 2. Pick the remaining tasks

Recall the Phase 2 task list (minus anything the pack now covers). Ask: **"Of these, which would save you the most pain if they ran themselves? Pick the ones you'd want working this week."** Aim for 3-5 total including the pack's first-win skill. The role card's "First tasks" list is your prompt sheet if they're stuck.

## 3. For each chosen task, in order, one at a time

- a. Clarify in at most 3 questions: What kicks it off? What does a good result look like? Where should the result go (a file, an email draft, a message)?
- b. Build the skill at `.claude/skills/<kebab-case-name>/SKILL.md` with frontmatter (`name`, `description` containing the natural trigger phrases they'd actually say) and a stepwise body: inputs, steps, output location, what NOT to do (respect the Phase 2 guardrails and the seat's approval boundary: nothing irreversible without sign-off).
- c. **Run it once, for real,** on a live input from their business. Not a demo. Show the output.
- d. Ask what's off. Fix the skill, not just the output. Re-run if the fix was significant.
- e. Add a row for the new skill to `.claude/reference/skills-routing-index.md` (trigger phrases + one-line purpose) - rule 04 routes from that index, so an unrouted skill is second-class until someone notices.
- f. If the skill writes into `clients/<name>/`, it must create `clients/<name>/STATUS.md` from a 5-line stub when missing (client, engagement, stage, channel, next step). Folders without STATUS.md are invisible to the registry and the dashboard.
- g. Record it under "First skills built" in the state file.

## 4. Keep each skill small

A skill that does one task well beats a mega-skill. If a task is too big, build the first useful slice and note the rest in `memory/kanban.md`.

One more default: operational outputs (briefs, status notes, summaries) bias to ONE SCREEN unless the user asks for depth - the people receiving them read one screen max.

## 5. Before leaving this phase

Run `node scripts/generate-registry.js`. The warning list must be EMPTY (no unrouted skills, no client folders missing STATUS.md, no pack drift). Fix anything it names; do not graduate drift.

## 6. Close the phase

Update state file and status page (Phase 5 done, Phase 6 current, overall 75%, pack cards current). Celebrate properly here; this is the moment the system started doing their work.

**Exit criteria:** 3-5 skills exist (pack skills count), each has run once on real input, the routing index carries them all, the registry runs clean, pack offer resolved (installed or declined, recorded both places), user has seen and reacted to each output.
