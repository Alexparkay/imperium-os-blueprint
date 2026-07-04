---
name: start-onboarding
description: "Guided first-run onboarding for this operating system. Role-aware and org-aware: detects whether this install is a solo seat, the first seat of a company, or a seat joining an existing org, then walks the user through 8 phases: welcome, identity + role, business context (company + seat), voice, connections, first skills + packs, cadence, and health baseline. Use when the user says 'I've just installed this, let's start', 'let's start', 'start onboarding', '/start', 'start setup', 'set this up', 'continue onboarding', 'where were we', 'resume setup', or anything signalling they are new here or returning mid-setup. Also triggers 'onboard [name]' for the operator sub-onboarding. ALWAYS read memory/onboarding-state.md first; if it exists, resume from the recorded phase instead of starting over."
metadata:
  title: Start Onboarding
  type: skill
  status: active
  created: 2026-06-11
  updated: 2026-07-02
---

# Start Onboarding (dispatcher)

You are about to walk a business user through setting up their AI operating system. They may have never opened a terminal. That is fine and expected. You do every technical step yourself; they answer questions and click things in their browser when a connector needs a sign-in.

This skill is the product's front door. Run it well.

This file is the dispatcher: state, tone, contracts, and the map. The detailed script for each phase lives in `phases/`; read the phase file **when you enter that phase**, not all at once. Role-specific interview questions, connector picks, and pack recommendations live in `roles/`.

## The map

| Phase | Name | Script | Uses a role card? |
|---|---|---|---|
| 0 | Welcome + tour + org detect | `phases/phase-0.md` | no |
| 1 | Identity + role + real operator | `phases/phase-1.md` | selects it |
| 2 | Business context (company + seat) | `phases/phase-2.md` | yes - seat interview |
| 3 | Voice | `phases/phase-3.md` | no |
| 4 | Connections | `phases/phase-4.md` | yes - connector picks |
| 5 | First skills + packs | `phases/phase-5.md` | yes - tasks + pack offer |
| 6 | Cadence + memory | `phases/phase-6.md` | no |
| 7 | Health baseline + graduation | `phases/phase-7.md` | no (reads state) |

All paths are relative to this skill's directory (`.claude/skills/start-onboarding/`).

## Role cards

Phase 1 records `user_role_type` and `department`; that selects the card:

| Answer | Card |
|---|---|
| owner / founder | `roles/owner.md` |
| solo operator (one-person business) | `roles/owner.md` (solo notes inside) |
| head of marketing / content / brand / growth | `roles/marketing.md` |
| head of ops / delivery / production | `roles/ops.md` |
| head of finance / money | `roles/finance.md` |
| operator or assistant running it for someone else | `roles/assistant.md` |
| any other department | nearest card by what the seat produces; note the gap in the state file ("bespoke role card - build item") |

Each card carries three things: the Phase 2 seat-interview questions for that role, the Phase 4 recommended connectors, and the Phase 5 first-task suggestions + department pack recommendation.

## Before anything else: check state

1. Read `memory/onboarding-state.md`.
2. **If it exists:** greet them back warmly, give a 2-line summary of what's done, and resume at `current_phase` (read that phase's file first). Example: "Welcome back. We've covered who you are and your seat, and GitHub backup is connected. We were in the middle of Phase 4, connecting Google Workspace. Pick up there?"
3. **If it does not exist:** this is a first run. Read `phases/phase-0.md` and begin.
4. **If `status: complete`:** onboarding is finished. Tell them so, point them at their skills, and ask what they'd like to do. Do not re-run phases unless they explicitly ask to redo one.
5. **If the trigger was "onboard [name]"** and the state file has a pending "operator sub-onboarding" item: run the operator sub-onboarding described in `phases/phase-7.md`.

Never ask the user a question the state file already answers.

## Tone rules (non-negotiable)

- **One question at a time.** Never stack questions. Wait for the answer, acknowledge it, then ask the next.
- **Zero jargon.** Never say repo, grep, frontmatter, CLI, env var, or token to the user. Say "the folder", "I'll search the files", "a settings file", "a key". If a technical word is unavoidable, explain it in the same sentence in under ten words.
- **You run every command.** Never tell the user to run something in a terminal. If a step needs a terminal, you do it and report the result in plain English.
- **Celebrate progress.** After every phase: one or two sentences on what just happened and what's next. Small wins out loud ("That's your business context locked in. Three phases down.").
- **Never blame the user.** If something fails, it's the system's job to recover. Say what happened, say what you're trying next, fix it.
- **Max ~7 questions per phase.** If you're tempted to ask an eighth, you're over-collecting. Move on; gaps can be filled later in normal conversation.
- **Brain dumps welcome.** If they answer one question with a ramble covering five, extract all five answers, confirm them in one short list, and skip the questions they already answered.
- **They can stop anytime.** If they say "let's pause" or go quiet, save state, update the status page, and tell them the exact sentence to type when they come back: "continue onboarding".

## The state file

Path: `memory/onboarding-state.md`. Create it at the end of Phase 0. Update it after **every phase** and after **every connector**. Format:

```markdown
---
type: onboarding-state
created: YYYY-MM-DD
updated: YYYY-MM-DD
current_phase: 0
status: in-progress
---

# Onboarding State

## Phase log
| Phase | Name | Status | Date |
|---|---|---|---|
| 0 | Welcome + tour + org detect | done | YYYY-MM-DD |
| 1 | Identity + role | in-progress | |
| 2 | Business context (company + seat) | pending | |
| 3 | Voice | pending | |
| 4 | Connections | pending | |
| 5 | First skills + packs | pending | |
| 6 | Cadence + memory | pending | |
| 7 | Health baseline | pending | |

## Answers
- owner_name: (the seat holder's full name)
- owner_short:
- user_role: (their words, e.g. "head of marketing", "founder")
- user_role_type: (owner | department-head | operator-for-someone | solo)
- department: (which function this seat serves; "-" for owner/solo seats)
- org_mode: (solo-or-first-seat at Phase 0, resolved in Phase 1 to solo | org-first-seat; or org-joining)
- real_operator: (name + role of who actually sits in this chat daily; status: none | pending | onboarded. "none" = the seat holder IS the operator)
- approval_boundary: (one line - what this seat decides vs escalates; detail lives in context/seat.md)
- os_name: (what the system is called; default "[company] OS")
- company_owner: (same as owner_name if this IS their company)
- company_name: (the HOME company; other ventures get context/<venture>.md)
- team_users: (who else works in the tools day to day - collected in Phase 4)
- currency:
- brand_assets: (colors/fonts or "not set")
- voice_split: (one voice, or personal + brand/published)
- owner_email:
- location:
- timezone:
- company_one_liner:
- icp:
- offer:
- repo_path:

## Privacy list
(things that must never appear in any output)

## Pending items
(open follow-ups that outlive onboarding, e.g. "operator sub-onboarding: [name]" from Phase 1)

## Connectors
| Connector | Status | Verified by | Date |
|---|---|---|---|
| google-workspace | pending | | |
| apify-youtube | pending | | |
| telegram-notify | pending | | |
| dropbox-rclone | optional | | |
| mcp-servers | optional | | |
| whatsapp-mcp | optional | | |
| higgsfield | optional | | |

## Packs
- packs_installed: (none yet)
- packs_declined: (none)

## Registry baseline (pre-install warnings)
(WARN lines from the Phase 0 `node scripts/generate-registry.js` run, or "(none)". The Phase 5 gate blocks only on NEW warnings versus this list.)

## Weekly task candidates (Phase 5 input)
-

## First skills built
-

## Notes for next session
-
```

Connector statuses: `pending`, `connected`, `skipped`, `deferred`, `optional`. Record HOW each was verified (the actual test that passed). Pack entries record the pack name, install date, and which skill got the first real run.

## The status page

Path: `docs/setup-status.html`. This is the visual dashboard of setup progress. **Update it after every phase and after every connector or pack change**, by editing the HTML directly. Stable hooks (also documented in the page's own header comment and in `docs/ONBOARDING-FLOW.md` - the three lists must match):

1. **Phase rows:** `<li class="phase" data-phase="N">`. Set `data-status` to `done`, `current`, or `pending`. Inside it, set the `.fill` div's inline style to `width:100%` (done), `width:50%` (current), or `width:0%` (pending).
2. **Overall ring:** `<div class="ring" id="overall-ring">`. Set `style="--p:X"` where X = (completed phases / 8) × 100, rounded: 0, 13, 25, 38, 50, 63, 75, 88, 100. Set the text inside `<span id="overall-pct">` to match.
3. **Current focus:** text inside `<p id="current-focus">`, one plain-English line.
4. **Connector cards:** `<div class="connector" data-name="...">`. Set `data-status` to `connected`, `pending`, `skipped`, `deferred`, or `optional`.
5. **Pack cards:** `<div class="pack" data-name="content-marketing|finance|ops|sales-crm">`. Set `data-status` to `available`, `recommended` (set when the role card names it), `installed`, or `declined`.
6. **Company name:** text inside `<span data-field="company-name">` (Phase 1).
7. **Seat line:** text inside `<span data-field="role">` and `<span data-field="department">` (Phase 1; for owner/solo seats set department to "whole company").
8. **Org-mode indicator:** text inside `<span id="org-mode">`. Use exactly one of: "Solo install", "First seat of your company", "Org seat - shared company truth".
9. **Last updated:** text inside `<span id="last-updated">`.
10. **Completion:** at the end of Phase 7, set `<body data-complete="true">` to reveal the completion banner.

After the first update in Phase 0, offer to open it: on Windows run `start docs/setup-status.html`, on Mac `open docs/setup-status.html`. Tell them to keep the tab; it always shows where setup stands.

## Placeholder passes (used by several phases)

The project ships with double-brace tokens like `{{OWNER_NAME}}`. When a phase says "run the placeholder pass" for some tokens:

- Search all files for the exact tokens (project-wide grep for `{{`).
- **Exclude** from replacement: `.git/`, `docs/ONBOARDING-FLOW.md`, and this skill's entire directory (`.claude/skills/start-onboarding/`) - they document the placeholder system itself.
- Replace each token with the collected answer, file by file.
- Re-run the search to confirm zero survivors of the replaced tokens outside the excluded files.
- **Report it in plain English:** "I've written your details into the system. [N] files updated." Then list the files as short bullets (file name + one-word reason). Never show diff output.

**Self-documentation convention (why the pass can't corrupt prose):** outside the excluded files, any prose that needs to MENTION a token names it without the double braces (backticked, e.g. the `OWNER_NAME` token) - see `.claude/CLAUDE.md`'s "First run" line for the shape. A raw double-brace token anywhere outside the excluded files is therefore ALWAYS a live fill target; replace it without hesitation. When writing new docs or pack manifests, follow the same convention - never put a raw double-brace token in a sentence that talks ABOUT the token.

The full token-by-token lifecycle (what fills when, the end-of-Phase-4 defaults table, and the deferred-ok allowlist that `scripts/package-check.js --client` enforces) lives in `docs/ONBOARDING-FLOW.md` and `phases/phase-4.md`.

## Recovery behaviours

- **User types a trigger phrase mid-phase:** re-read state, confirm position, continue. Never restart Phase 0 on top of existing answers.
- **State file is corrupted or half-written:** rebuild it from evidence (which context files exist, which tokens are already replaced, what the settings file contains) and confirm your reconstruction with the user in one short summary before continuing.
- **User wants to skip a phase:** allowed, except Phase 1 (identity and role gate everything else). Mark it `skipped` in the phase log and tell them the sentence that resumes it later ("run the voice setup").
- **User asks an unrelated question mid-onboarding:** answer it properly, then offer: "Want to get back to setup? We were on [phase]."
