---
title: Onboarding Flow
product: Imperium OS
type: maintainer-doc
audience: installers and maintainers
created: 2026-06-11
updated: 2026-07-02
---

# Onboarding Flow (source of truth)

This is the maintainer's view of the guided onboarding, v2: role-aware and org-aware. The executable version lives at `.claude/skills/start-onboarding/` (a dispatcher `SKILL.md` plus per-phase scripts and role cards); if the two ever disagree, fix the skill to match this document, then commit both together.

## The skill's shape

```
.claude/skills/start-onboarding/
  SKILL.md          dispatcher: state contract, tone rules, status-page contract,
                    resume logic, phase map, role-card map, placeholder-pass procedure
  phases/
    phase-0.md .. phase-7.md    one script per phase, read on entry (keeps the
                                always-loaded surface small)
  roles/
    owner.md marketing.md ops.md finance.md assistant.md
```

Each role card carries three sections consumed by three phases: the Phase 2 seat-interview questions, the Phase 4 recommended connectors (with pre-written benefit sentences), and the Phase 5 first-task suggestions + department pack recommendation.

## Design principles

- **One question at a time, max ~7 per phase.** Over-collection kills momentum. Gaps get filled in normal use.
- **The user never touches a terminal.** Claude runs every command and reports results in plain English.
- **Verify before advancing.** A connector is not "done" because the steps were followed; it's done when its test passes.
- **Multi-session safe.** All progress lives in `memory/onboarding-state.md`. Any trigger phrase resumes from the recorded phase.
- **Visible progress.** `docs/setup-status.html` is updated after every phase and every connector or pack change.
- **Momentum beats completeness.** Anything that fails twice gets deferred with a note, not debugged in front of the user.
- **Use the wait.** Whenever the user is off doing a browser step, Claude works in parallel: background installs, pre-staged `.env` lines, prepared verification commands. The user never watches a progress bar.
- **Onboard the seat, not just the signature.** The buyer, the seat holder, and the daily operator can be three different people. The flow detects each and fits itself to the person actually in the chair.

## Trigger phrases

`I've just installed this, let's start` · `let's start` · `start onboarding` · `/start` · `start setup` · `set this up` · `continue onboarding` · `where were we` · `resume setup` · `onboard [name]` (operator sub-onboarding)

On any trigger: read `memory/onboarding-state.md` first. Missing file = fresh run from Phase 0. Existing file = resume at `current_phase`. `status: complete` = onboarding over; don't re-run unless asked.

## Org-detect logic (Phase 0)

Before the welcome, the skill checks two signals:

1. `ORG_CONTEXT_REPO` set in the root `.env` (equivalently: `node scripts/org-sync.js --status` reports a repo URL).
2. `context/org/company.md` carries real content rather than template state (`status: template` frontmatter or surviving `{{...}}` tokens = template-fresh).

Either signal filled → `org_mode: org-joining`: the OS greets already knowing the company ("this hour is about YOU: your seat, your voice, your tools") and Phase 2 confirms org truth instead of re-interviewing it. Both template-fresh → `org_mode: solo-or-first-seat`, a provisional value that Phase 1 resolves to `solo` or `org-first-seat` (by asking whether other people will get their own seat).

In org-joining mode, `context/org/` is a read-only mirror (rule 32): the flow never edits it; corrections become proposals in `memory/org-proposals/`.

## The role-card system (Phase 1)

Phase 1's role question records `user_role_type` (owner | department-head | operator-for-someone | solo) and `department`, which select a card:

| user_role_type / department | Card |
|---|---|
| owner, solo | `roles/owner.md` |
| department-head: marketing / content / brand / growth | `roles/marketing.md` |
| department-head: ops / delivery / production | `roles/ops.md` |
| department-head: finance | `roles/finance.md` |
| operator-for-someone | `roles/assistant.md` |
| department-head: anything else | nearest card by what the seat produces + a "bespoke role card" note in the state file |

## The real-operator rule (Phase 1, enforced in Phase 7)

Phase 1 always asks: **"Who will actually sit in this chat most days - you, or someone who runs things for you?"** This exists because of a real deal where the contract signer was not the daily user, and the daily user (an assistant) had been scoped out entirely - it nearly cost adoption.

If someone else is named: their name + role land in `context/seat.md` ("The real operator") and in the state file (`real_operator`, `status: pending`), plus a pending item "operator sub-onboarding: [name]". While that item is pending, **no health check may score Context above 7/10** - the cap lives in BOTH `phases/phase-7.md` (the baseline) and `.claude/skills/project-health/SKILL.md` (every weekly re-audit after graduation), and its unlock (a 20-minute sub-onboarding, trigger "onboard [name]", spec at the bottom of `phases/phase-7.md`) is stated to the user in plain terms.

## State file

`memory/onboarding-state.md`. The exact template lives in the skill's `SKILL.md`. Keys, v2 additions marked:

- Phase log (0-7, status + date)
- `owner_name`, `owner_short`, `user_role`, `company_owner`, `company_name`, `team_users`, `currency`, `brand_assets`, `voice_split`, `owner_email`, `location`, `timezone`, `company_one_liner`, `icp`, `offer`, `repo_path`
- **`user_role_type`** (owner | department-head | operator-for-someone | solo) *(v2)*
- **`department`** *(v2)*
- **`org_mode`** (solo-or-first-seat → solo | org-first-seat; or org-joining) *(v2)*
- **`real_operator`** (name/role + status: none | pending | onboarded) *(v2)*
- **`approval_boundary`** (one line; detail in `context/seat.md`) *(v2)*
- **`os_name`** *(v2)*
- Privacy list
- **Pending items** (e.g. operator sub-onboarding) *(v2)*
- Connector table (status + verification evidence + date)
- **Packs: `packs_installed` / `packs_declined`** *(v2)*
- Weekly task candidates, first skills built, notes for next session

## Placeholder lifecycle

| Token | Filled in | Written to |
|---|---|---|
| `{{REPO_PATH}}` | Phase 0 (auto-detected) | everywhere |
| `{{OWNER_NAME}}` `{{OWNER_SHORT}}` `{{OWNER_ROLE}}` `{{COMPANY_NAME}}` `{{OWNER_EMAIL}}` `{{LOCATION}}` `{{TIMEZONE}}` | Phase 1 - EXCEPT the owner/principal lines in `context/org/company.md`, `glossary.md`, and `people-roster.md` on non-owner seats (department-head / operator-for-someone): the owner-line guard holds those for Phase 2, which fills them from the explicit `company_owner` answer, never from the seat holder's identity | everywhere |
| `{{OS_NAME}}` | Phase 1 (the naming question; offered default: company name + " OS") | context/identity.md |
| `{{CCY}}` | Phase 2 (offer question collects the currency) | finance skills |
| `{{COMPANY_ONE_LINER}}` `{{ICP}}` `{{OFFER}}` | Phase 2, both branches: Branch A fills them from the company interview; Branch B distils the same three values from the mirrored `context/org/` files, confirms them during the read-back, and runs the same pass (the pre-filled org files carry the truth, but live base files outside `context/org/` still hold the tokens until this pass runs) | everywhere |
| `{{VOICE_SAMPLE}}` | Phase 3 | everywhere |
| `{{BRAND_PRIMARY}}` `{{BRAND_NEUTRALS}}` `{{BRAND_FONTS}}` | Phase 3 (brand-assets question; default "not set - ask the owner") | presentation-builder |
| `{{NOTIFY_CHANNEL}}` | Phase 4 (Telegram step); deferred-ok while telegram-notify is skipped or deferred - the notify rule and notify-deliver skill carry a "not configured - skip silently" runtime fallback | everywhere |
| `{{DEPLOY_TARGET}}` | Phase 4 end-sweep (default: `none configured (local only)` - the shipped deploy rule already carries the default; the sweep row exists so a literal token can never survive onboarding) | deploy rule (`rules-import/06`) |
| `{{MEDIA_STORE}} (and {{MEDIA_HUB_DRIVE_ID}} if Drive media saving is wanted)` | Phase 4 (optional Dropbox / media-hub steps) | everywhere |
| `{{FOLDER_*}}` (media hub) | google-workspace connector, media-hub setup step; dormant if skipped | media-hub skill |
| `{{OWNER_SOUL_ID}}` | Phase 4 (optional Higgsfield step) | everywhere |
| `{{OWNER_SOUL_CINEMATIC_ID}}` `{{OWNER_WARDROBE_STYLE}}` `{{OWNER_COLOR_PALETTE}}` `{{OWNER_PHYSIQUE_NOTES}}` `{{OWNER_ACCESSORIES}}` `{{OWNER_AESTHETIC_AVOID}}` `{{OWNER_TEXT_DEFAULTS}}` | Phase 4 (optional Higgsfield step, alongside `{{OWNER_SOUL_ID}}`); dormant if skipped | owner-likeness rule (`rules-import/26`) |
| `{{DEPARTMENT}}` | Phase 2 (departments interview / seat interview) | context/org/departments.md |
| `{{BANK_*}}` `{{COMPETITOR_CHANNEL_*}}` | at pack install (`node scripts/install-pack.js <pack>`), by the pack's own setup questions (finance asks for account names, content-marketing asks for competitor channels), written into the INSTALLED copy under `.claude/skills/`; if the question is skipped, the skill fills them on its first real run (the fill-on-first-use rule is written into each skill). The `packs/` source copies stay tokenized by design - they are the reinstall template | finance-audit / video-score pack skills |

Replacement passes always exclude `.git/`, `docs/ONBOARDING-FLOW.md` (this file), and the entire start-onboarding skill directory (`.claude/skills/start-onboarding/`), because they document the tokens. **Self-documentation convention:** outside those excluded files, prose that mentions a token names it WITHOUT the double braces (backticked, e.g. the `OWNER_NAME` token), so a raw double-brace token outside the excluded files is always a live fill target and the passes can never corrupt documentation. Every pass ends with a re-grep to confirm zero remaining occurrences of the replaced tokens, and a plain-English files-touched report to the user.

`scripts/package-check.js` enforces this lifecycle: tokens outside this table warn in template mode, and in `--client` mode any surviving token outside the documenting files fails the build **unless it is on the deferred-ok allowlist below, in one of its allowed paths**.

### Deferred-ok tokens (client-mode allowlist)

The single source of truth for tokens that MAY survive onboarding because their feature is dormant until a connector or pack step runs. Phase 4's end-of-phase sweep (`phases/phase-4.md`, section 6) and `scripts/package-check.js --client` both read this table - the script parses the rows between the two HTML markers, so keep the format: column 1 lists backticked token patterns (a trailing `*` matches the prefix family), column 2 lists backticked path prefixes where survivors are allowed, column 3 is prose. A token surviving anywhere else, or any token not in this table, fails `--client`.

<!-- deferred-ok:start -->
| Token pattern | Allowed paths | Dormant until |
|---|---|---|
| `{{FOLDER_*}}` | `.claude/skills/media-hub/` | the google-workspace media-hub setup runs (Phase 4, optional) |
| `{{OWNER_SOUL_*}}` | `.claude/rules-import/26-owner-likeness-generation.md` · `packs/content-marketing/skills/higgsfield/` · `.claude/skills/higgsfield/` | the Higgsfield connector is configured (Phase 4, optional) |
| `{{OWNER_WARDROBE_STYLE}}` `{{OWNER_COLOR_PALETTE}}` `{{OWNER_ACCESSORIES}}` `{{OWNER_PHYSIQUE_NOTES}}` `{{OWNER_AESTHETIC_AVOID}}` `{{OWNER_TEXT_DEFAULTS}}` | `.claude/rules-import/26-owner-likeness-generation.md` | the Higgsfield connector's look-rules step (Phase 4, optional) |
| `{{NOTIFY_CHANNEL}}` | `.claude/rules-import/12-notify-owner.md` · `.claude/skills/notify-deliver/` | the telegram-notify connector is verified (runtime falls back to "not configured - skip silently") |
| `{{BANK_*}}` | `packs/finance/skills/finance-audit/` · `.claude/skills/finance-audit/` | the finance pack's account-names question, or finance-audit's first real run |
| `{{COMPETITOR_CHANNEL_*}}` | `packs/content-marketing/skills/video-score/` · `.claude/skills/video-score/` | the content-marketing pack's competitor question, or video-score's first real run |
<!-- deferred-ok:end -->

## The phases

### Phase 0 - Welcome + tour + org detect

- **Goal:** install type detected; the user understands chat/memory/skills and the folders; install path set.
- **Branch:** org-detect (above) picks the greeting - standard welcome, or the "click into place" greeting for org-joining seats.
- **Questions:** 1 ("Shall we start?").
- **Actions:** welcome + folder tour (org-joining adds one line about the shared, propose-upward org files); detect repo path and replace `{{REPO_PATH}}`; start the `automations/youtube` dependency install in the background; run `node scripts/generate-registry.js` once and record its warning lines in the state file as the **pre-install registry baseline** (the Phase 5 gate compares against it); create the state file with `org_mode`; first status-page update (org-mode indicator set if already known); offer to open the page.
- **Exit criteria:** org mode recorded; state file exists (registry baseline included); status page current; user consented.

### Phase 1 - Identity + role + real operator

- **Goal:** the system knows whose seat this is, what kind of seat it is, and who actually operates it; identity placeholders filled repo-wide.
- **Questions:** 7 - name; role (the four-way taxonomy, with department follow-up and, for operator seats, the relayed-instruction calibration); **the real-operator question (mandatory)**; company (multi-venture branch: HOME company + `context/<venture>.md` per extra venture; plus the 10-second naming beat → `os_name`); email; location + timezone (travel mode); privacy list.
- **Branch:** resolves provisional `org_mode`; selects the role card; a named non-user operator creates the pending sub-onboarding item.
- **Actions:** privacy list → `.claude/rules/13-owner-privacy.md`; fill `context/seat.md` (who sits here + real operator); replace `{{OS_NAME}}` in `context/identity.md` (deleting the marker comment and the expired "While unfilled" fallback sentence); placeholder pass for the seven identity tokens **with the owner-line guard** (on non-owner seats the owner/principal lines in `context/org/company.md`, `glossary.md`, `people-roster.md` are held for Phase 2's explicit `company_owner` answer - the seat holder is never written into shared org truth as owner); verify by re-grep; report files touched; status page gets company name, role, department, org-mode.
- **Exit criteria:** role card selected; real-operator answer recorded; re-grep clean; report delivered; state + status page updated.

### Phase 2 - Business context (company + seat)

- **Goal:** the system knows the company AND this seat's corner of it.
- **Branch A (solo / org-first-seat):** the 7-question company interview (one-liner + team; the owner question on non-owner seats → `company_owner`; ICP; offers + currency; positioning + NOT list; weekly check-in places; weekly time-eaters + incoming requests; guardrails) + optional glossary follow-up → writes `context/org/company.md`, `offers.md`, `glossary.md`, `departments.md`, and `people-roster.md` (owner/principal lines from `company_owner`, the seat holder under their real role), reviews `Home.md`, replaces `{{COMPANY_ONE_LINER}}` `{{ICP}}` `{{OFFER}}`, flips the filled files' frontmatter to `status: active`, reads the summary back.
- **Branch B (org-joining):** read back the pre-loaded org truth (one-liner, their department's row, key glossary terms) for confirmation - ~2 minutes; corrections filed to `memory/org-proposals/` per rule 32, never edited into the mirror; the three business tokens (`{{COMPANY_ONE_LINER}}` `{{ICP}}` `{{OFFER}}`) filled in base files from the org truth and confirmed during the read-back; the weekly-places and weekly-tasks questions still run, scoped to the seat.
- **Both branches, then:** the **seat interview** from the role card - department mission, KPIs, who the seat answers to, who lands requests on it, approval boundary → `context/seat.md` + `approval_boundary` in state; seat summary read back.
- **Exit criteria:** branch outputs written (or confirmed); seat file filled and confirmed; state + status page updated.

### Phase 3 - Voice

- **Goal:** output sounds like the person in the chair (the daily operator owns the voice; a pending operator inherits a TODO in their sub-onboarding).
- **Questions:** 3 (personal-vs-published voice → `voice_split`, with `brand-voice.md` TODO slot when split; paste 2-3 writing samples; brand colours/fonts → `{{BRAND_*}}` or safe default) + 1 live-test reaction.
- **Actions:** samples → `content-pipeline/voice-profile/sample-NN.md`; build `voice-guide.md`; replace `{{VOICE_SAMPLE}}`; draft a real 3-line email; iterate on the correction.
- **Exit criteria:** live test approved.

### Phase 4 - Connections (C2)

- **Goal:** the tools they already use are plugged in, one at a time, each verified.
- **The menu:** `docs/connectors/INDEX.md` - every connector with benefit, key y/n, effort bucket (5 min / 15 min / build team), and per-role relevance. The plan = universal spine (github-backup → google-workspace) + the role card's picks filtered by Phase 2 answers. `org-sync`, `company-brain`, `worker` are named-not-run: install-team engagements.
- **Opens with the team question** ("who else works in these tools?") → `team_users`. Multi-seat answer is now real: each person can get their own seat sharing org truth via `docs/connectors/org-sync.md` (install team) - noted in state, never improvised solo.
- **Per-connector loop:** pre-written one-sentence benefit (no improvised jargon) → "now, later, or skip?" → follow `docs/connectors/<name>.md` (user does browser steps, Claude does all commands and edits) → run the guide's verification test → update state table + status card → next. Keys pasted in chat go straight to `.env` and are never echoed back.
- **End-sweep:** project-wide `{{` grep resolved against the defaults table in `phases/phase-4.md`; decisions logged per token.
- **Failure policy:** two attempts, then `deferred` with a note. May span multiple sessions.
- **Exit criteria:** every connector `connected`/`skipped`/`deferred` by explicit choice; every `connected` row records the passed test; sweep logged.

### Phase 5 - First skills + packs (C3)

- **Goal:** 3-5 real weekly tasks running as skills, each proven on live input; the department pack question answered.
- **Pack offer first:** the role card names ONE pack + one-line pitch. Yes → `node scripts/install-pack.js <pack>`, then the pack's own questions (`packs/<pack>/onboarding.md`), then ONE pack skill walked on a real input as the first win; recorded in `packs_installed` + status card `installed`. No → `packs_declined` + card `declined`, no re-pitch that session. Multi-pack allowed, one recommended to start.
- **Then build the rest:** pick from the Phase 2 task list; ≤3 clarifiers per skill; build at `.claude/skills/<kebab-name>/SKILL.md`; run for real; fix the skill from the reaction; row it into `.claude/reference/skills-routing-index.md`; STATUS.md stubs for touched client folders.
- **Gate:** `node scripts/generate-registry.js` reports **no NEW warnings versus the pre-install baseline** captured in Phase 0 (machine-local warnings that pre-date the install - e.g. differing user-global rule copies - never block; anything the install introduced does).
- **Exit criteria:** 3-5 proven skills (pack skills count); routing complete; registry gate passed; pack offer resolved both places.

### Phase 6 - Cadence + memory bootstrap (C4)

- **Goal:** run-rhythm decided; memory seeded.
- **Questions:** 1 per skill (scheduled vs on-demand; recommend on-demand for week one) + 1 ("top 3 things on your plate this week?").
- **Actions:** `## Cadence` on each skill (pack skills included); seed `memory/kanban.md` + `memory/calendar.md` (pending operator item goes on the board); explain the memory targets; run the registry.
- **Exit criteria:** cadence recorded; board seeded; registry regenerated (no new warnings vs the Phase 0 baseline).

### Phase 7 - Health baseline + graduation

- **Goal:** measured starting point; clean handoff.
- **Actions:** `project-health` Four C's baseline, **with the real-operator gate: Context capped at 7/10 while the operator sub-onboarding is pending** (cap + unlock stated to the user); baseline saved as the FIRST dated entry in `memory/system_changelog.md` (seat, org mode, scores, connectors, packs - never privacy-list items); `node scripts/os-lint.js` with trivial fixes applied; 5-bullet week-one plan (pending operator item outranks everything); org-first-seat installs get the org-repo reminder (`docs/connectors/org-sync.md`) in Notes for next session; graduation message; state `status: complete`; page to 100% + completion banner.
- **After graduation:** "onboard [name]" runs the operator sub-onboarding (identity-lite, their voice profile, their view of the seat's boundaries) and lifts the Context cap - spec at the bottom of `phases/phase-7.md`.
- **Exit criteria:** baseline in the changelog; gate applied if due; lint run; plan on the board; state complete; page at 100%.

## Status page contract

The skill edits `docs/setup-status.html` directly. Stable hooks (mirrored in the page's header comment and in the skill's SKILL.md - the three lists must match; do not rename without updating all three):

- `li.phase[data-phase="0..7"]` with `data-status="pending|current|done"` and an inner `.fill` div whose inline `width` is the phase progress.
- `#overall-ring` with inline `style="--p:N"` and `#overall-pct` text (N = completed/8 × 100, rounded to 0/13/25/38/50/63/75/88/100).
- `#current-focus` one-line text.
- `.connector[data-name="github-backup|google-workspace|apify-youtube|telegram-notify|dropbox-rclone|mcp-servers|whatsapp-mcp|higgsfield"]` with `data-status="pending|connected|skipped|deferred|optional"` (vocabulary matches the state-file connector table exactly - a parked connector renders as "Deferred", never as a blank chip).
- `.pack[data-name="content-marketing|finance|ops|sales-crm"]` with `data-status="available|recommended|installed|declined"` (set `recommended` when the role card names it, `installed`/`declined` when Phase 5 resolves it).
- `span[data-field="company-name"]`, `span[data-field="role"]`, `span[data-field="department"]` (all set in Phase 1; owner/solo seats show department "whole company").
- `#org-mode` - exactly one of: "Solo install", "First seat of your company", "Org seat - shared company truth".
- `#last-updated` date text.
- `body[data-complete="true"]` reveals the completion banner.

## Maintainer notes

- Keep the interview question wording in the phase files; this doc describes intent, the skill owns the words.
- If you add a connector: five edits, always together - guide in `docs/connectors/`, row in `docs/connectors/INDEX.md`, row in the state-file template (SKILL.md), card on the status page, mention in the right role cards. **Exception:** install-team-tier connectors (`org-sync`, `company-brain`, `worker`) and `claude-code-install` (a precondition, not a guided step) get the guide + INDEX row only - Phase 4 names them and records interest under the state file's "Pending items"; state-file rows and status-page cards are for guided connectors.
- If you add a role card: add it to the card map in SKILL.md and here, and give it all three sections (seat interview, connectors, first tasks + pack).
- If you add a pack: it needs a status-page card, a row in the state file's Packs section, and a home in at least one role card's recommendation logic.
- The quality bar for every user-facing sentence in this flow: a smart non-technical operator can act on it without a call.
