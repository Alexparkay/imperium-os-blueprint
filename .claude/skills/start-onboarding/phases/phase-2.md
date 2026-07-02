# Phase 2 - Business context (company + seat)

**Goal:** the system knows the company AND this seat's corner of it. Which half you do depends on `org_mode`.

- `solo` or `org-first-seat` → **Branch A** (full company interview) then **the seat interview**.
- `org-joining` → **Branch B** (confirm the pre-loaded company truth, ~2 minutes) then **the seat interview**.

The seat-interview questions come from the role card selected in Phase 1.

---

## Branch A - company interview (solo and first-seat installs)

Output: `context/org/company.md`, `context/org/offers.md`, `context/org/glossary.md`, `context/org/departments.md`, `context/org/people-roster.md` filled in; `Home.md` reviewed.

Ask, one at a time (acknowledge each answer before the next):

1. **"Tell me about [company] in a couple of sentences. What do you do, and roughly who works there?"** → distil a one-liner, read it back for approval → `company_one_liner`. The "who works there" half also seeds the departments and people-roster files below.

   **1b. The owner question (non-owner seats only).** If `user_role_type` is `department-head`: **"And who owns or leads [company]? I have you as head of [department] - I need the company's principal on file so the shared company records name the right person."** → `company_owner`. (On the operator-for-someone path, Phase 1 already collected `company_owner` - confirm it in one line instead of re-asking.) If they genuinely can't or won't name one, record `company_owner: pending`, add a pending item ("confirm the company owner - org files carry a pending marker until then"), and carry on. If `user_role_type` is `owner` or `solo`, skip this - `company_owner` = `owner_name`.
2. **"Who do you sell to? Describe your ideal customer the way you'd describe them to a new hire."** → `icp`.
3. **"And what do you sell them? Names and rough prices welcome."** → `offer`. Note the currency they price in → `currency`, and replace `{{CCY}}` across the project with it (pass procedure in SKILL.md).
4. **"How do you want the company described when it matters, and what do people sometimes mistake you for that you are definitely NOT?"** → positioning + anti-positioning.
5. **"Where do you go each week to check on the business? Think: revenue numbers, customer data, your calendar, team chat, tasks, documents."** → store under "Weekly task candidates / connections" in state. (Light touch here; Phase 4 goes deep.)
6. **"What are 3 to 5 tasks you or your team do every single week that eat time? And what requests FROM other people eat your time - the asks that land on you?"** → store both for Phase 5. (Incoming-request pain - "make this look better", "status?", "find me the file" - is a different skill category from task pain, and people forget to name it unless asked.)
7. **"Anything this system must never do? Think compliance lines, tone limits, and things that should always wait for your sign-off, like sending emails or invoices."** → guardrails.

If their answers used company-specific terms (product names, internal shorthand), ask one follow-up: "You used a few terms I want to get exactly right: [list]. Give me a one-liner on each?" → glossary entries.

Then do the work:

- **Resolve the owner/principal lines first.** Fill the owner/principal lines in `context/org/company.md` and `context/org/glossary.md` with `company_owner` (on owner/solo seats Phase 1's pass already did this; on non-owner seats these are the token survivors the Phase 1 owner-line guard held back). If `company_owner` is pending, write `(pending - confirm the company owner)` instead of a name. The seat holder appears in these files under their REAL role, never as owner/principal unless they are.
- Write `context/org/company.md` (what the company is, who works there, positioning, the NOT list, guardrails).
- Write `context/org/offers.md` (each offer: who it's for, what it includes, price if given).
- Write `context/org/glossary.md` (terms + one-line definitions).
- Fill `context/org/departments.md` from the "who works there" answer: one row per real function, who leads it, who approves what (fold in the sign-off answers from question 7). Solo business? One row ("Everything - [first name]") is a legitimate org chart; never invent departments.
- **Write `context/org/people-roster.md` from the Phase 2 answers**, not from the identity pass: the owner/principal row = `company_owner` (or the pending marker), one row for the seat holder under their real role and department, plus anyone else named in "who works there". Delete the worked fictional example.
- Review `Home.md` (the domain map): confirm the company name landed from Phase 1 and adjust any domain-table row whose description doesn't match how their business actually runs. The structure is fixed - most installs need no changes here.
- Run the placeholder pass for `{{COMPANY_ONE_LINER}}`, `{{ICP}}`, `{{OFFER}}`. Report files touched.
- **Flip the frontmatter** of every file filled above from `status: template` to `status: active` (company.md, offers.md, glossary.md, departments.md, people-roster.md, Home.md) - org-detect and downstream tooling read that field as the template-fresh signal.
- **Read their context back to them** as a tight summary and ask: "Anything wrong or missing?" Fix before moving on.

## Branch B - confirm the pre-loaded truth (org-joining installs)

The org files in `context/org/` arrived filled. Do NOT re-interview the company; do NOT edit those files - in org mode they are a read-only mirror, and corrections travel upward (`memory/org-proposals/`, rule 32).

1. **Read back the essentials, tight:** the company one-liner, their department's row from `context/org/departments.md` (who leads it, what it owns, who approves what), and 2-3 glossary terms their department uses. Then ask: **"Does that match reality from where you sit?"**
2. **If something is wrong or missing:** capture it, write a proposal file to `memory/org-proposals/` (format: `memory/org-proposals/README.md`), and tell them in one line: "The company files are shared with every seat, so I've sent that correction to [company]'s org admin rather than editing it here. It'll reach every seat once approved."
3. Pull `currency` from the org files (only ask if it's missing there), and replace `{{CCY}}` across the project with it (pass procedure in SKILL.md).
4. **Fill the base-file business tokens from org truth.** The mirrored org files carry the company one-liner, ICP, and offers, but live base skills OUTSIDE `context/org/` still hold the `{{COMPANY_ONE_LINER}}`, `{{ICP}}`, and `{{OFFER}}` tokens on an org-joining install. Distil each of the three values from `context/org/company.md` + `offers.md` (one tight line each), confirm them as part of the read-back ("I'll use these as the working one-liner / ICP / offer summaries inside your tools - sound right?"), then run the placeholder pass for `{{COMPANY_ONE_LINER}}`, `{{ICP}}`, `{{OFFER}}` with those values. This edits base files only - never the org mirror. Report files touched.
5. Questions 5 and 6 from Branch A (weekly check-in places; weekly time-eating tasks + incoming requests) still apply to THIS seat - ask both, scoped to their department. Store for Phases 4 and 5.

## The seat interview (both branches)

Open the role card (`roles/<card>.md`) and run its "Seat interview" section: department mission, the 2-4 numbers this seat is measured on, who this seat answers to, who lands requests on it, and the approval boundary. Five questions, role-flavoured, one at a time.

Then do the work:

- Write the answers into `context/seat.md`: approval boundary, department KPIs, key stakeholders. (The seat file is always local and editable, in every mode.) Flip its frontmatter to `status: active`.
- Record `approval_boundary` in the state file (one line; the detail lives in the seat file).
- Delete the worked fictional example at the bottom of `context/seat.md` once the real content is in.
- **Read the seat summary back:** "Here's how I understand your seat: [mission, numbers, boundaries]. Anything off?" Fix before moving on.

## Close the phase

- Update state file and status page (Phase 2 done, Phase 3 current, overall 38%).
- Celebrate. Branch A: "That's your business context locked in. Three phases down." Branch B: "Company confirmed, seat mapped. The system now knows your corner of [company]."

**Exit criteria:** Branch A - five org files (company, offers, glossary, departments, people-roster) written with the owner/principal lines resolved from `company_owner` (never defaulted to a non-owner seat holder), Home.md reviewed, three business tokens replaced, frontmatter flipped to active, summary confirmed. Branch B - org truth confirmed (corrections filed as proposals, never edits), three business tokens filled from org truth and confirmed. Both - `context/seat.md` filled from the role card and confirmed, `approval_boundary` recorded.
