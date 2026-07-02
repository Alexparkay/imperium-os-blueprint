# Phase 1 - Identity + role + real operator

**Goal:** know who they are, what kind of seat this is, who ACTUALLY sits in it, and fill the identity placeholders across the whole system.

Ask, one at a time:

## 1. Name

**"First things first: what's your full name?"** → `owner_name`. Derive the first name and confirm: "I'll call you [first name]. Work for you?" → `owner_short`. (The `owner_*` keys name the seat holder; they keep that name even when the seat holder doesn't own the company.)

## 2. Role

**"Where do you sit in the business? Are you the owner, do you run a department, do you run things day to day for someone else, or is it just you - a one-person operation?"**

Record `user_role` in their words and `user_role_type` as one of:

- **owner / founder** - it's their company.
- **head of department** - follow up: **"Which department - what does your part of the company own?"** → `department`.
- **operator / assistant running it for someone** - follow up: whose seat is this really (the principal's name → `company_owner`)? This answer changes three things downstream: (a) the privacy rule describes them by their REAL role, never as "founder"; (b) company-level answers they're unsure of (revenue, ICP, offers) get stored as "best guess - unconfirmed, verify with [owner]" instead of as facts; (c) when the owner's instructions arrive secondhand ("[owner] wants X"), the system treats them as the owner's call on brand and strategy questions.
- **solo operator** - one-person business; they are owner, department, and operator in one.

**Resolve `org_mode` if it's still provisional.** If Phase 0 recorded `solo-or-first-seat`: a solo operator means `org_mode: solo`. Otherwise ask: **"Will anyone else at [company] get their own copy of this system later - other department heads, a partner?"** Yes or probably → `org_mode: org-first-seat`. No → `org_mode: solo`. (A department head answering with template-fresh org files is almost always `org-first-seat`.)

**Select the role card** from the table in SKILL.md and note it in the state file. Phases 2, 4, and 5 will read it.

## 3. The real operator (mandatory - never skip this one)

**"Who will actually sit in this chat most days - you, or someone who runs things for you?"**

This question exists because of a real install where the person who signed was not the person who would use it daily - and the daily person had been scoped out entirely. The system must fit the person in the chair.

- **If it's them:** record `real_operator: none` (the seat holder is the operator) and move on.
- **If they name someone else** (an assistant, a deputy, a shared login):
  - Capture the name and role into the "The real operator" section of `context/seat.md` and into `real_operator` in the state file with `status: pending`.
  - Add a pending item to the state file: "operator sub-onboarding: [name] - identity, voice, and their view of this seat. Trigger: 'onboard [name]'."
  - Tell them plainly: "Then [name] is who I need to fit. When we're done today, a 20-minute session with [name] finishes the job - their writing voice, how they phrase requests, what they handle without asking you. Until that happens I'll flag it in the health score."
  - The Phase 7 health baseline may NOT score Context above 7/10 while this item is pending (the rule is written in `phases/phase-7.md`).

## 4. Company

**"What's your company called?"** → `company_name`. **If they name more than one business:** don't force a single answer. Ask which one this system runs day to day - that's the HOME company and becomes `company_name`. Every other venture gets its own one-page context file at `context/<venture-slug>.md` (what it is, how it relates to the home company, what rules apply) plus a glossary entry, so they never have to re-explain it. Tell them exactly that, in one sentence. (On the org-joining path, the company name is already known - confirm it instead of asking.)

**4b. Name the system** (the fun one, ten seconds): **"This system needs a name - it's what I'll call myself. Most people go with '[Company] OS', but anything works. What'll it be?"** → `os_name`. Then open `context/identity.md` and replace `{{OS_NAME}}` with the chosen name; in the same edit, delete the marker comment above it AND the now-expired fallback sentence on the Name line (`While unfilled, refer to itself as "your operating system" - never invent a name.`), and flip the file's frontmatter to `status: active`. From this moment, refer to yourself by that name.

## 5. Email

**"What email do you run the business from?"** → `owner_email`.

## 6. Location + timezone

**"Where are you based, and what timezone should I work in?"** → `location`, `timezone`. **If they travel a lot** (the answer sounds like "X, but I'm in Y half the time"): store the home base as `timezone`, and tell them: "I'll work in [home timezone]; when you're on the road just say 'I'm in [city]' and I'll think in that day." Note `travels: yes` in the state file.

## 7. Privacy list

**"Last one for this part: is there anything I should treat as private and never include in anything I write, ever? People often list things like their age, home address, revenue figures, or family names. Whatever you name goes on a privacy list that every part of this system respects."** → privacy list.

## Then do the work

1. **Write the privacy list** into the owner-privacy rule at `.claude/rules/13-owner-privacy.md` (replace the placeholder bullet under its "## Private list" section). If that file doesn't exist, write the list to `memory/owner-privacy.md` and note it in the state file. Also copy the list into the state file.

2. **Fill `context/seat.md`.** The "Who sits here" section (seat holder, role, department, manager if known) and "The real operator" section, from the answers above. The approval boundary and KPI sections wait for Phase 2's seat interview - leave them.

3. **The placeholder pass** (procedure in SKILL.md): replace `{{OWNER_NAME}}`, `{{OWNER_SHORT}}`, `{{OWNER_ROLE}}` (use `user_role`), `{{COMPANY_NAME}}`, `{{OWNER_EMAIL}}`, `{{LOCATION}}`, `{{TIMEZONE}}` across the project. Re-grep to confirm zero survivors outside the excluded files, then deliver the plain-English files-touched report. Tokens like `{{ICP}}`, `{{OFFER}}`, `{{COMPANY_ONE_LINER}}`, `{{VOICE_SAMPLE}}`, `{{NOTIFY_CHANNEL}}`, `{{OWNER_SOUL_ID}}`, `{{MEDIA_STORE}}` are filled in later phases. Leave them.

   **Owner-line guard (hard rule):** three org files hard-bind the owner tokens to company ownership - `context/org/company.md` ("Owner / principal"), `context/org/glossary.md` (the People row), and `context/org/people-roster.md` (the Team row). If `user_role_type` is `owner` or `solo`, fill them normally - the seat holder IS the owner. If it is `department-head` or `operator-for-someone`, the seat holder does NOT own the company: **skip the `{{OWNER_NAME}}`/`{{OWNER_SHORT}}` occurrences on those owner/principal lines in those three files** and leave the tokens standing. Phase 2 fills them from the explicit "who owns [company]" answer (Branch A asks it; `company_owner` from the operator branch above feeds it too). Note the deferral in the state file ("org owner lines pending Phase 2") so the re-grep exception is auditable - these lines are the ONLY sanctioned identity-token survivors between Phases 1 and 2. Never write the seat holder into shared org truth as owner/principal.

4. **Update the status page:** Phase 1 done, Phase 2 current, overall 25%. Set the company name (`data-field="company-name"`), the seat line (`data-field="role"` and `data-field="department"` - for owner/solo seats set department to "whole company"), and the org-mode indicator (`#org-mode`): "Solo install", "First seat of your company", or "Org seat - shared company truth".

5. Update the state file. Celebrate: "The system now knows whose seat this is. Next: ten minutes on the business itself." (Org-joining: "...Next: two minutes confirming what I already know about [company], then your seat.")

**Exit criteria:** 7 answers stored, role card selected, real-operator answer recorded (with the pending item if someone else was named), privacy list written, `{{OS_NAME}}` and the seven identity tokens replaced and verified (on non-owner seats, minus the three org owner/principal lines held for Phase 2 under the owner-line guard, with the deferral noted in the state file), files-touched report delivered.
