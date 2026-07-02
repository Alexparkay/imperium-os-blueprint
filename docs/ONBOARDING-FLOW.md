---
title: Onboarding Flow
product: Imperium OS
type: maintainer-doc
audience: installers and maintainers
created: 2026-06-11
---

# Onboarding Flow (source of truth)

This is the maintainer's view of the guided onboarding. The executable version lives at `.claude/skills/start-onboarding.md`; if the two ever disagree, fix the skill to match this document, then commit both together.

## Design principles

- **One question at a time, max ~7 per phase.** Over-collection kills momentum. Gaps get filled in normal use.
- **The user never touches a terminal.** Claude runs every command and reports results in plain English.
- **Verify before advancing.** A connector is not "done" because the steps were followed; it's done when its test passes.
- **Multi-session safe.** All progress lives in `memory/onboarding-state.md`. Any trigger phrase resumes from the recorded phase.
- **Visible progress.** `docs/setup-status.html` is updated after every phase and every connector. It's the non-technical user's window into setup.
- **Momentum beats completeness.** Anything that fails twice gets deferred with a note, not debugged in front of the user.
- **Use the wait.** Whenever the user is off doing a browser step, Claude works in parallel: background installs, pre-staged `.env` lines, prepared verification commands, slow verifies started as background tasks while the conversation moves to the next connector. The user never watches a progress bar.

## Trigger phrases

`I've just installed this, let's start` · `let's start` · `start onboarding` · `/start` · `start setup` · `set this up` · `continue onboarding` · `where were we` · `resume setup`

On any trigger: read `memory/onboarding-state.md` first. Missing file = fresh run from Phase 0. Existing file = resume at `current_phase`. `status: complete` = onboarding over; don't re-run unless asked.

## State file

`memory/onboarding-state.md`. Holds: current phase, phase log, all interview answers, the privacy list, the connector table (status + verification evidence + date), Phase 5 task candidates, skills built, and notes for the next session. Updated after every phase and every connector. The skill defines the exact format.

## Placeholder lifecycle

| Token | Filled in | Written to |
|---|---|---|
| `{{REPO_PATH}}` | Phase 0 (auto-detected) | everywhere |
| `{{OWNER_NAME}}` `{{OWNER_SHORT}}` `{{OWNER_ROLE}}` `{{COMPANY_NAME}}` `{{OWNER_EMAIL}}` `{{LOCATION}}` `{{TIMEZONE}}` | Phase 1 | everywhere |
| `{{CCY}}` | Phase 2 (offer question collects the currency) | finance-audit skill |
| `{{BRAND_PRIMARY}}` `{{BRAND_NEUTRALS}}` `{{BRAND_FONTS}}` | Phase 3 (brand-assets question; default "not set - ask the owner") | presentation-builder |
| `{{DEPLOY_TARGET}}` | Phase 4 end-sweep (default: `none configured (local only)` - it sits in always-loaded instructions, a literal token must never survive onboarding) | CLAUDE.md, deploy rule |
| `{{FOLDER_*}}` (media hub) | google-workspace connector, media-hub setup step; dormant if skipped | media-hub skill |
| `{{COMPANY_ONE_LINER}}` `{{ICP}}` `{{OFFER}}` | Phase 2 | everywhere |
| `{{VOICE_SAMPLE}}` | Phase 3 | everywhere |
| `{{NOTIFY_CHANNEL}}` | Phase 4 (Telegram step) | everywhere |
| `{{OWNER_SOUL_ID}}` | Phase 4 (optional Higgsfield step) | everywhere |
| `{{MEDIA_STORE}} (and {{MEDIA_HUB_DRIVE_ID}} if Drive media saving is wanted)` | Phase 4 (optional Dropbox step) | everywhere |

Replacement passes always exclude `.git/`, `docs/ONBOARDING-FLOW.md` (this file), and the start-onboarding skill itself, because they document the tokens. Every pass ends with a re-grep to confirm zero remaining occurrences of the replaced tokens, and a plain-English files-touched report to the user.

## The phases

### Phase 0 - Welcome + tour

- **Goal:** the user understands chat/memory/skills and the 7 daily folders; install path is set.
- **Questions:** 1 ("Shall we start?").
- **Actions:** deliver welcome + folder tour; explain brain dumps are fine; detect repo path and replace `{{REPO_PATH}}`; start the `automations/youtube` dependency install as a background task; create state file; first status-page update; offer to open the status page in the browser.
- **Outputs:** `memory/onboarding-state.md`; `{{REPO_PATH}}` resolved.
- **Exit criteria:** state file exists; status page shows Phase 0 done; user consented to continue.

### Phase 1 - Identity

- **Goal:** the system knows who it works for; identity placeholders filled repo-wide.
- **Questions:** 6 (full name → confirm short name; **role: their company or someone else's** → `user_role`/`company_owner`; company - with the multi-company branch: HOME company + `context/<venture>.md` per extra venture; email; location + timezone incl. travel mode; privacy list).
- **Actions:** write privacy list into the owner-privacy rule (`.claude/rules/13-owner-privacy.md`); run the placeholder pass for the six identity tokens; verify by re-grep; report files touched.
- **Outputs:** privacy list persisted; six tokens replaced everywhere.
- **Exit criteria:** re-grep clean; files-touched report delivered; state + status page updated.

### Phase 2 - Business context

- **Goal:** the 7-question interview; the context spine exists.
- **Questions:** 7 (company in two sentences; ICP; offers; positioning + NOT list; weekly check-in places; 3-5 weekly time-eating tasks; hard constraints) + optional glossary follow-up.
- **Actions:** write `context/company.md`, `context/offers.md`, `context/glossary.md`; fill `Home.md`; replace `{{COMPANY_ONE_LINER}}` `{{ICP}}` `{{OFFER}}`; read the summary back for correction. Questions 5 and 6 are collected lightly here and consumed by Phases 4 and 5.
- **Outputs:** four context files; three tokens replaced.
- **Exit criteria:** owner confirmed the read-back summary; state + status page updated.

### Phase 3 - Voice

- **Goal:** output sounds like the owner.
- **Questions:** 3 (personal-vs-published voice → `voice_split`, with `brand-voice.md` TODO slot when split; paste 2-3 writing samples; brand colours/fonts → `{{BRAND_*}}` or safe default) + 1 live-test reaction ("does this sound like you?").
- **Actions:** save samples to `content-pipeline/voice-profile/sample-NN.md`; build `voice-guide.md` (cadence, vocabulary, sign-offs, banned words); replace `{{VOICE_SAMPLE}}`; draft a real 3-line email in their voice; iterate on their correction.
- **Outputs:** samples + voice guide; token replaced.
- **Exit criteria:** live test approved by the owner.

### Phase 4 - Connections (the Four C's audit, C2)

- **Goal:** the tools they already use are plugged in, one at a time, each verified.
- **Priority order:** GitHub backup → Google Workspace → Apify/YouTube → Telegram notify → optional (Dropbox/rclone, MCP servers, WhatsApp, Higgsfield). Order adapts to their actual stack from the Phase 2 audit.
- **Opens with the team question** ("who else works in these tools?") → `team_users`; multi-seat is named honestly as a build-team item, never improvised.
- **Per-connector loop:** PRE-WRITTEN one-sentence benefit (no improvised jargon) → "now, later, or skip?" → follow `docs/connectors/<name>.md` (user does browser steps, Claude does all commands and file edits) → run the guide's verification test → update state table + status-page card → next. Keys pasted in chat go straight to `.env` and are never echoed back.
- **Failure policy:** two attempts, then `deferred` with a note. Resume any day with "let's finish setting up [name]".
- **Outputs:** connector table fully resolved; `{{NOTIFY_CHANNEL}}` (and optionally `{{OWNER_SOUL_ID}}`, `{{MEDIA_STORE}}`) replaced.
- **Exit criteria:** every connector is `connected`, `skipped`, or `deferred` by explicit owner choice; every `connected` row records the test that passed. May span multiple sessions.

### Phase 5 - First skills (C3, Capabilities)

- **Goal:** 3-5 real weekly tasks become skills, each run once on live input.
- **Questions:** 1 (pick from the Phase 2 task list) + up to 3 clarifiers per skill (trigger, good result, output destination).
- **Actions:** build each skill at `.claude/skills/<kebab-name>.md` with auto-trigger description and guardrail-aware body; run it for real; fix the skill (not just the output) from the owner's reaction.
- **Outputs:** 3-5 new skills, each with one real run behind it, each rowed into `.claude/reference/skills-routing-index.md`; client folders touched get STATUS.md stubs.
- **Exit criteria:** owner has seen and reacted to every skill's output; `node scripts/generate-registry.js` warning list EMPTY; state + status page updated.

### Phase 6 - Cadence + memory bootstrap (C4, Cadence)

- **Goal:** run-rhythm decided; memory seeded.
- **Questions:** 1 per skill (scheduled vs on-demand; recommend on-demand for week one) + 1 ("top 3 things on your plate this week?").
- **Actions:** record `## Cadence` on each skill; seed `memory/kanban.md` and `memory/calendar.md`; explain the memory targets in plain English; run `node scripts/generate-registry.js`.
- **Outputs:** cadence noted; kanban/calendar seeded; registry generated.
- **Exit criteria:** registry build succeeds; state + status page updated.

### Phase 7 - Health baseline + graduation

- **Goal:** measured starting point; clean handoff to daily use.
- **Questions:** 0.
- **Actions:** run `project-health` (Four C's scores out of 10) and record the baseline in `memory/system_changelog.md`; run `node scripts/os-lint.js` and fix trivial findings; write the 5-bullet week-one plan to the kanban; deliver the graduation message ("if you can't see it, just ask in the chat"); set state `status: complete`; status page to 100% with the completion banner (`<body data-complete="true">`).
- **Exit criteria:** baseline recorded; lint run; plan on kanban; state complete; page at 100%.

## Status page contract

The skill edits `docs/setup-status.html` directly. Stable hooks it relies on (do not rename without updating the skill):

- `li.phase[data-phase="0..7"]` with `data-status="pending|current|done"` and an inner `.fill` div whose inline `width` is the phase progress.
- `#overall-ring` with inline `style="--p:N"` and `#overall-pct` text (N = completed/8 × 100, rounded to 0/13/25/38/50/63/75/88/100).
- `#current-focus` one-line text.
- `.connector[data-name="github-backup|google-workspace|apify-youtube|telegram-notify|dropbox-rclone|mcp-servers|whatsapp-mcp|higgsfield"]` with `data-status="pending|connected|skipped|deferred|optional"` (vocabulary matches the state-file connector table exactly - a parked connector renders as "Deferred", never as a blank chip).
- `span[data-field="company-name"]` (set in Phase 1) and `#last-updated`.
- `body[data-complete="true"]` reveals the completion banner.

## Maintainer notes

- Keep the interview question wording in the skill; this doc describes intent, the skill owns the words.
- If you add a connector: write the guide in `docs/connectors/`, add a row to the state-file template in the skill, add a card to the status page, and add it to the Phase 4 priority list. Four edits, always together.
- The quality bar for every user-facing sentence in this flow: a smart non-technical operator can act on it without a call.
