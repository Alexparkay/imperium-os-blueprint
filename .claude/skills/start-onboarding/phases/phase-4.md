# Phase 4 - Connections

**Goal:** plug the system into the tools they already use. One connector at a time. Verify each before starting the next.

The menu lives at `docs/connectors/INDEX.md`: every connector, its plain-English benefit, whether it needs a key, the effort bucket, and which roles it serves. Use it to build the plan; use the per-connector guides (`docs/connectors/<name>.md`) to run each setup.

## 1. Open the phase

**Recall their Phase 2 answer** about where they go each week. Then ask one question before starting: **"Who else works in these tools day to day - an assistant, a partner, a team member?"** → `team_users` in the state file.

If someone shares the inbox or pipeline, give the honest answer: each of those people can get their own seat - a separate install of this same system that shares [company]'s context, so five people never hold five drifting versions of the truth. Setting up extra seats is an install-team job (guide: `docs/connectors/org-sync.md`); until then, a second person can sit at this install, and a second machine can pull the same system from the backup. Note anyone who should get a seat in the state file.

## 2. Build the plan

Present a short plan: "Based on what you told me, here's what I suggest we connect, in order. We'll do them one at a time and test each before moving on."

- **Universal spine first, for every seat:** `github-backup` → `google-workspace`. Benefit sentences are PRE-WRITTEN - use these words or closer; never improvise the intro ("repository", "versioned", "API", "token" are banned in intro sentences):
  1. `github-backup` - "If your laptop dies tomorrow, your whole system is safe in a private cloud copy, and anything can be rolled back." Guide: `docs/connectors/github-backup.md`.
  2. `google-workspace` - "I can read your calendar and draft from your email, so 'what does my week look like' just works." Guide: `docs/connectors/google-workspace-gws.md`.
- **Then the role picks:** open the role card's "Recommended connectors" section and filter it against their Phase 2 answers - only propose what matches where their work actually lives. Each card carries its own pre-written benefit sentences.
- **Install-team tier:** `org-sync`, `company-brain`, and `worker` are set up WITH the install team, not walked through here. If the plan or the user's answers touch them (multiple seats, live dashboards, always-on automation), name them in one sentence each and record the interest under "Pending items" in the state file (these connectors have no row in the connector table by design - see the exception in `docs/connectors/INDEX.md`) - never attempt the setup solo mid-onboarding.
- Mention the relevant optional connectors in the opening plan summary, not after an hour - past the one-hour mark everything optional gets skipped unheard. If they ask for a connector the catalog doesn't have (social analytics is the most common ask), say so honestly and point at `docs/connectors/not-yet.md` (known gaps + workarounds); log the want in the state file.

## 3. The loop, for each connector

- a. One sentence on what it does for THEM, tied to their business. ("Telegram means your phone buzzes with results when I finish a research job, even when you're away from the desk.")
- b. Ask: **"Want to set this up now, later, or skip it?"** Respect the answer. `later` → mark `deferred` and move on, no guilt.
- c. If now: open the guide at `docs/connectors/<name>.md` and follow it. The guide splits every step into *what you do* (browser clicks, sign-ins, copying a key into the chat) and *what I do* (every command, every file edit). Walk them through their steps one at a time.
- d. If they paste a key or token: write it into `.env` yourself, confirm "Saved. That key never leaves this folder", and never echo the key back in chat.
- e. **Verify.** Run the guide's verification test (each guide ends with one). Show the result in plain English. A connector is only `connected` when its test passes.
- f. Update the state file connector table (status + how verified + date) and the status page connector card.
- g. Brief win ("That's your work backed up from now on."), then offer the next connector.
- When Telegram is verified, record the bot token + chat id location as `{{NOTIFY_CHANNEL}}` → replace that token across the project with `.env (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID)`.

## 4. Use the wait (parallel setup)

Connector setup has natural dead time: whenever the user is off in a browser creating an account, finding a key, or waiting on a confirmation email, you work. Standing rules:

- The moment you send them to a browser step, immediately: pre-stage the `.env` line the key will land in, pre-fill the connector's state-table row, and have the verification command ready, so the second the key arrives you save + test in one step.
- If a verification is slow (a first sync, an install, a long fetch), start it as a background task, say "that's running in the background", and move to the NEXT connector's one-sentence intro while it finishes. Report the result the moment it lands.
- Anything that needs no input from them (background installs, creating folders, seeding files, the GitHub backup push after the token is saved) runs in the background by default while the conversation moves forward.
- Never make the user watch a progress bar. If they are waiting on you for more than ~30 seconds, say what's happening in one line.

## 5. Connector-specific placeholder fills

Do these as part of the relevant connector's verify step. **Deferred counts as skipped for token purposes:** whenever a rule below says "skipped", apply it to `deferred` too, and log which default landed where in the state file - when a deferred connector is finished later, its guide's fill step replaces the recorded default value (or fills the still-standing dormant token), so nothing is lost by defaulting now.

- `dropbox-rclone` connected → ask where their media should canonically live (e.g. a folder named after the company), then replace every `{{MEDIA_STORE}}` token across the project with that path. If they skip or defer the connector, replace `{{MEDIA_STORE}}` with `local: content-pipeline/media/ (no cloud media store configured yet)` so no orphan tokens remain.
- `google-workspace` connected AND they want generated assets auto-saved to Drive → create a "Media Hub" shared folder structure with them (Generated/, Documents/, Content Assets/), write the folder ids to `.claude/reference/media-hub-folders.json`, and replace `{{MEDIA_HUB_DRIVE_ID}}` with the root folder id. If skipped or deferred, replace `{{MEDIA_HUB_DRIVE_ID}}` with `not-configured` and note in the state file that the media-hub rule is dormant.
- `higgsfield` connected → fill `{{OWNER_SOUL_ID}}` (and the aesthetic fields in the owner-likeness rule) per that guide. If skipped or deferred, leave the tokens and record the connector's status (the likeness rule is dormant until then; the tokens are on the deferred-ok allowlist in `docs/ONBOARDING-FLOW.md`).

## 6. End-of-phase token sweep

Run a project-wide grep for `{{` and resolve every remaining token using this default table - "leave" is only allowed for tokens on the deferred-ok allowlist in `docs/ONBOARDING-FLOW.md` (dormant features that never load into always-on instructions). Deferred connectors take the same branch as skipped ones (see section 5's rule).

| Token family | If not collected by now | Why |
|---|---|---|
| `{{DEPLOY_TARGET}}` | replace with `none configured (local only)` | it sits in always-loaded instructions; a literal token must never survive onboarding |
| `{{CCY}}` | replace with the Phase 2 currency, or `USD` + a note | finance skills read it |
| `{{BRAND_PRIMARY}}/{{BRAND_NEUTRALS}}/{{BRAND_FONTS}}` | replace with `not set - ask the owner before any branded deliverable` | stops literal tokens reaching presentations |
| `{{FOLDER_*}}` | leave ONLY if the google-workspace media hub was skipped or deferred; they live in one dormant skill | filled by the media-hub setup in its guide |
| `{{OWNER_SOUL_ID}}` + likeness fields | leave if higgsfield skipped or deferred (dormant rule) | filled by that connector's guide |
| `{{NOTIFY_CHANNEL}}` | leave if telegram-notify was skipped or deferred - deferred-ok | the notify rule (`rules-import/12`) and the notify-deliver skill carry a "not configured - skip silently" runtime fallback; the Telegram verify step (section 3) fills it when the connector lands |

Log the decision per token in the state file. The grep result after this step should contain NO token outside the deferred-ok allowlist paths (and the files that document the tokens, per the pass exclusions in SKILL.md).

## 7. Failure policy

If a connector fails: stay calm, never blame them. Try the guide's "what can go wrong" section. If still stuck after two attempts, mark it `deferred`, add a note to "Notes for next session" in the state file, and move on. Momentum beats completeness; a deferred connector can be finished any day by saying "let's finish setting up [name]".

## 8. Close the phase

This phase can span multiple sessions. Update state after EVERY connector, not just at phase end. When required connectors are connected or consciously deferred: update status page (Phase 4 done, Phase 5 current, overall 63%).

**Exit criteria:** every connector in the table is `connected`, `skipped`, or `deferred` by the user's explicit choice; each `connected` row records a passed test; the token sweep is logged.
