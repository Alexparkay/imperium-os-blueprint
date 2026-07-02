# Phase 2 - Business context (company + seat)

**Goal:** the system knows the company AND this seat's corner of it. Which half you do depends on `org_mode`.

- `solo` or `org-first-seat` → **Branch A** (full company interview) then **the seat interview**.
- `org-joining` → **Branch B** (confirm the pre-loaded company truth, ~2 minutes) then **the seat interview**.

The seat-interview questions come from the role card selected in Phase 1.

---

## Branch A - company interview (solo and first-seat installs)

Output: `context/org/company.md`, `context/org/offers.md`, `context/org/glossary.md`, `context/org/departments.md`, `Home.md` filled in.

Ask, one at a time (acknowledge each answer before the next):

1. **"Tell me about [company] in a couple of sentences. What do you do, and roughly who works there?"** → distil a one-liner, read it back for approval → `company_one_liner`. The "who works there" half also seeds the departments file below.
2. **"Who do you sell to? Describe your ideal customer the way you'd describe them to a new hire."** → `icp`.
3. **"And what do you sell them? Names and rough prices welcome."** → `offer`. Note the currency they price in → `currency`, and replace `{{CCY}}` across the project with it (pass procedure in SKILL.md).
4. **"How do you want the company described when it matters, and what do people sometimes mistake you for that you are definitely NOT?"** → positioning + anti-positioning.
5. **"Where do you go each week to check on the business? Think: revenue numbers, customer data, your calendar, team chat, tasks, documents."** → store under "Weekly task candidates / connections" in state. (Light touch here; Phase 4 goes deep.)
6. **"What are 3 to 5 tasks you or your team do every single week that eat time? And what requests FROM other people eat your time - the asks that land on you?"** → store both for Phase 5. (Incoming-request pain - "make this look better", "status?", "find me the file" - is a different skill category from task pain, and people forget to name it unless asked.)
7. **"Anything this system must never do? Think compliance lines, tone limits, and things that should always wait for your sign-off, like sending emails or invoices."** → guardrails.

If their answers used company-specific terms (product names, internal shorthand), ask one follow-up: "You used a few terms I want to get exactly right: [list]. Give me a one-liner on each?" → glossary entries.

Then do the work:

- Write `context/org/company.md` (what the company is, who works there, positioning, the NOT list, guardrails).
- Write `context/org/offers.md` (each offer: who it's for, what it includes, price if given).
- Write `context/org/glossary.md` (terms + one-line definitions).
- Fill `context/org/departments.md` from the "who works there" answer: one row per real function, who leads it, who approves what (fold in the sign-off answers from question 7). Solo business? One row ("Everything - [first name]") is a legitimate org chart; never invent departments.
- Fill in `Home.md` with their actual domains.
- Run the placeholder pass for `{{COMPANY_ONE_LINER}}`, `{{ICP}}`, `{{OFFER}}`. Report files touched.
- **Read their context back to them** as a tight summary and ask: "Anything wrong or missing?" Fix before moving on.

## Branch B - confirm the pre-loaded truth (org-joining installs)

The org files in `context/org/` arrived filled. Do NOT re-interview the company; do NOT edit those files - in org mode they are a read-only mirror, and corrections travel upward (`memory/org-proposals/`, rule 32).

1. **Read back the essentials, tight:** the company one-liner, their department's row from `context/org/departments.md` (who leads it, what it owns, who approves what), and 2-3 glossary terms their department uses. Then ask: **"Does that match reality from where you sit?"**
2. **If something is wrong or missing:** capture it, write a proposal file to `memory/org-proposals/` (format: `memory/org-proposals/README.md`), and tell them in one line: "The company files are shared with every seat, so I've sent that correction to [company]'s org admin rather than editing it here. It'll reach every seat once approved."
3. Pull `currency` from the org files (only ask if it's missing there), and replace `{{CCY}}` across the project with it (pass procedure in SKILL.md).
4. Questions 5 and 6 from Branch A (weekly check-in places; weekly time-eating tasks + incoming requests) still apply to THIS seat - ask both, scoped to their department. Store for Phases 4 and 5.

## The seat interview (both branches)

Open the role card (`roles/<card>.md`) and run its "Seat interview" section: department mission, the 2-4 numbers this seat is measured on, who this seat answers to, who lands requests on it, and the approval boundary. Five questions, role-flavoured, one at a time.

Then do the work:

- Write the answers into `context/seat.md`: approval boundary, department KPIs, key stakeholders. (The seat file is always local and editable, in every mode.)
- Record `approval_boundary` in the state file (one line; the detail lives in the seat file).
- Delete the worked fictional example at the bottom of `context/seat.md` once the real content is in.
- **Read the seat summary back:** "Here's how I understand your seat: [mission, numbers, boundaries]. Anything off?" Fix before moving on.

## Close the phase

- Update state file and status page (Phase 2 done, Phase 3 current, overall 38%).
- Celebrate. Branch A: "That's your business context locked in. Three phases down." Branch B: "Company confirmed, seat mapped. The system now knows your corner of [company]."

**Exit criteria:** Branch A - four org files + Home.md written, three business tokens replaced, summary confirmed. Branch B - org truth confirmed (corrections filed as proposals, never edits). Both - `context/seat.md` filled from the role card and confirmed, `approval_boundary` recorded.
