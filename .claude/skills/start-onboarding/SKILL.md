---
name: start-onboarding
description: "Guided first-run onboarding for this operating system. Walks a non-technical owner through 8 phases: welcome, identity, business context, voice, connections, first skills, cadence, and health baseline. Use when the user says 'I've just installed this, let's start', 'let's start', 'start onboarding', '/start', 'start setup', 'set this up', 'continue onboarding', 'where were we', 'resume setup', or anything signalling they are new here or returning mid-setup. ALWAYS read memory/onboarding-state.md first; if it exists, resume from the recorded phase instead of starting over."
metadata:
  title: Start Onboarding
  type: skill
  status: active
  created: 2026-06-11
---

# Start Onboarding

You are about to walk a business owner through setting up their AI operating system. They may have never opened a terminal. They may not know what a repo is. That is fine and expected. You do every technical step yourself; they answer questions and click things in their browser when a connector needs a sign-in.

This skill is the product's front door. Run it well.

## Before anything else: check state

1. Read `memory/onboarding-state.md`.
2. **If it exists:** greet them back warmly, give a 2-line summary of what's done, and resume at `current_phase`. Example: "Welcome back. We've covered your identity and business context, and GitHub backup is connected. We were in the middle of Phase 4, connecting Google Workspace. Pick up there?"
3. **If it does not exist:** this is a first run. Begin at Phase 0.
4. **If `status: complete`:** onboarding is finished. Tell them so, point them at their skills, and ask what they'd like to do. Do not re-run phases unless they explicitly ask to redo one.

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
| 0 | Welcome + tour | done | YYYY-MM-DD |
| 1 | Identity | in-progress | |
| 2 | Business context | pending | |
| 3 | Voice | pending | |
| 4 | Connections | pending | |
| 5 | First skills | pending | |
| 6 | Cadence + memory | pending | |
| 7 | Health baseline | pending | |

## Answers
- owner_name:
- owner_short:
- user_role:
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

## Connectors
| Connector | Status | Verified by | Date |
|---|---|---|---|
| github-backup | pending | | |
| google-workspace | pending | | |
| apify-youtube | pending | | |
| telegram-notify | pending | | |
| dropbox-rclone | optional | | |
| mcp-servers | optional | | |
| whatsapp-mcp | optional | | |
| higgsfield | optional | | |

## Weekly task candidates (Phase 5 input)
-

## First skills built
-

## Notes for next session
-
```

Connector statuses: `pending`, `connected`, `skipped`, `deferred`, `optional`. Record HOW each was verified (the actual test that passed).

## The status page

Path: `docs/setup-status.html`. This is the visual dashboard of setup progress. **Update it after every phase and after every connector change**, by editing the HTML directly:

1. **Phase rows:** find `<li class="phase" data-phase="N"`. Set `data-status` to `done`, `current`, or `pending`. Inside it, set the `.fill` div's inline style to `width:100%` (done), `width:50%` (current/in progress), or `width:0%` (pending).
2. **Overall ring:** find `<div class="ring" id="overall-ring"`. Set `style="--p:X"` where X = (completed phases / 8) × 100, rounded: 0, 13, 25, 38, 50, 63, 75, 88, 100. Set the text inside `<span id="overall-pct">` to match (e.g. `38%`).
3. **Current focus card:** set the text inside `<p id="current-focus">` to one plain-English line, e.g. "Connecting Google Workspace so I can read your calendar and docs."
4. **Connector cards:** find `<div class="connector" data-name="<connector>"`. Set `data-status` to `connected`, `pending`, `skipped`, or `optional`.
5. **Company name:** in Phase 1, replace the text inside `<span data-field="company-name">` with the real company name.
6. **Last updated:** set the text inside `<span id="last-updated">` to today's date.
7. **Completion:** at the end of Phase 7, set `<body data-complete="true">` to reveal the completion banner.

After the first update in Phase 0, offer to open it: on Windows run `start docs/setup-status.html`, on Mac `open docs/setup-status.html`. Tell them to keep the tab; it always shows where setup stands.

---

# The phases

## Phase 0 - Welcome + tour

**Goal:** they understand what they have and how to talk to it. You set the install path.

1. Deliver the welcome (adapt, don't paste robotically):

   > Welcome. You've just installed an AI operating system for your company. Here's the whole mental model: there's a chat (this), a memory (a set of folders that hold everything I learn about your business), and skills (pre-built workflows I run when you ask). You talk to me in plain English and I do the technical work. You never need to open a terminal, and you can't break anything by talking to me.

2. Give the 60-second tour, one line per folder:
   - `context/` is the one-page truth about your company. I read it at the start of every session.
   - `memory/` is where everything you tell me lands: people, decisions, deadlines, ideas.
   - `clients/` gets one folder per client engagement.
   - `content-pipeline/` holds drafts, published work, and your voice profile.
   - `automations/` holds the running tools, like YouTube research and phone notifications.
   - `dashboard/` is where your live company dashboard will eventually live.
   - `docs/` holds the guides and your setup progress page.

3. Tell them how to talk to it: full sentences, half sentences, voice-dictated rambles, all fine. Multiple topics in one message, fine. It will sort the pieces out. Mention there's a one-page visual of how everything fits together at `docs/system-map.html`; offer to open it now or note it for later (don't push, the tour already covered the essentials).

4. **Detect the install path.** Run `pwd` (or read the workspace root). Search the project for the literal text `{{REPO_PATH}}` and replace every occurrence with the detected absolute path (forward slashes), EXCLUDING these (they document the token itself and must keep it): `docs/ONBOARDING-FLOW.md` and this skill file (`.claude/skills/start-onboarding/SKILL.md`). Note the files touched; you'll report them with the Phase 1 pass.

5. **Start the slow work now, in the background.** Kick off `npm install` inside `automations/youtube/` as a background task (it is the only module with dependencies). Don't narrate it; by the time Phase 4 needs it, it's done. If it fails, note it in the state file and retry during Phase 4.

6. Create `memory/onboarding-state.md` from the template above, with phase 0 marked done and `current_phase: 1`.

7. Update the status page (Phase 0 done, Phase 1 current, overall 13%). Offer to open it in their browser.

8. Ask the one Phase 0 question: **"Ready to set this up around you? It takes about an hour, and you can stop anytime and pick up where you left off. Shall we start?"**

**Exit criteria:** state file exists, status page updated, user said yes.

## Phase 1 - Identity

**Goal:** know who they are, and fill the identity placeholders across the whole system.

Ask, one at a time:

1. **"First things first: what's your full name?"** → `owner_name`. Derive the first name and confirm: "I'll call you [first name]. Work for you?" → `owner_short`.
2. **"Is this your company, or do you run a part of it for someone else?"** → `user_role` (e.g. founder, creative director, ops lead) and, if they're not the owner, `company_owner` (the owner's name). This one answer changes three things downstream: (a) the privacy rule describes them by their REAL role, never as "founder"; (b) company-level answers they're unsure of (revenue, ICP, offers) get stored as "best guess - unconfirmed, verify with [owner]" instead of as facts; (c) when the owner's instructions arrive secondhand ("[owner] wants X"), the system treats them as the owner's call on brand and strategy questions. Replace `{{OWNER_ROLE}}` across the project with their role (same pass procedure as below).
3. **"What's your company called?"** → `company_name`. **If they name more than one business:** don't force a single answer. Ask which one this system runs day to day - that's the HOME company and becomes `company_name`. Every other venture gets its own one-page context file at `context/<venture-slug>.md` (what it is, how it relates to the home company, what rules apply) plus a glossary entry, so the owner never has to re-explain it. Tell them exactly that, in one sentence.
4. **"What email do you run the business from?"** → `owner_email`.
5. **"Where are you based, and what timezone should I work in?"** → `location`, `timezone`. **If they travel a lot** (the answer sounds like "X, but I'm in Y half the time"): store the home base as `timezone`, and tell them: "I'll work in [home timezone]; when you're on the road just say 'I'm in [city]' and I'll think in that day." Note `travels: yes` in the state file.
6. **"Last one for this part: is there anything I should treat as private and never include in anything I write, ever? People often list things like their age, home address, revenue figures, or family names. Whatever you name goes on a privacy list that every part of this system respects."** → privacy list.

Then do the work:

7. **Write the privacy list** into the owner-privacy rule at `.claude/rules/13-owner-privacy.md` (replace the placeholder bullet under its "## Private list" section). If that file doesn't exist, write the list to `memory/owner-privacy.md` and note it in the state file. Also copy the list into the state file.

8. **The placeholder pass.** This is a find-replace across the entire project:
   - Search all files for these exact tokens: `{{OWNER_NAME}}`, `{{OWNER_SHORT}}`, `{{OWNER_ROLE}}`, `{{COMPANY_NAME}}`, `{{OWNER_EMAIL}}`, `{{LOCATION}}`, `{{TIMEZONE}}` (use a project-wide grep for `{{`).
   - **Exclude** from replacement: `.git/`, `docs/ONBOARDING-FLOW.md`, and this skill file (they document the placeholder system itself).
   - Replace each token with the collected answer, file by file.
   - Re-run the search to confirm those six tokens no longer appear outside the excluded files.
   - **Report it in plain English:** "I've written your details into the system. [N] files updated, including your main instructions, the home page, and the context files." Then list the files as short bullets (file name + one-word reason). Do not show diff output.
   - Tokens like `{{ICP}}`, `{{OFFER}}`, `{{COMPANY_ONE_LINER}}`, `{{VOICE_SAMPLE}}`, `{{NOTIFY_CHANNEL}}`, `{{OWNER_SOUL_ID}}`, `{{MEDIA_STORE}}` are filled in later phases. Leave them.

9. Update the status page: Phase 1 done, Phase 2 current, overall 25%, and set the company name in the header (`data-field="company-name"`).

10. Update the state file. Celebrate: "The system now knows who it works for. Next: ten minutes on what [company] actually does."

**Exit criteria:** 5 answers stored, privacy list written, six identity tokens replaced and verified, files-touched report delivered.

## Phase 2 - Business context

**Goal:** the 7-question interview. Output: `context/company.md`, `context/offers.md`, `context/glossary.md`, `Home.md` filled in.

Ask, one at a time (acknowledge each answer before the next):

1. **"Tell me about [company] in a couple of sentences. What do you do, and roughly who works there?"** → distil a one-liner, read it back for approval → `company_one_liner`.
2. **"Who do you sell to? Describe your ideal customer the way you'd describe them to a new hire."** → `icp`.
3. **"And what do you sell them? Names and rough prices welcome."** → `offer`. Note the currency they price in → `currency`, and replace `{{CCY}}` across the project with it (same pass procedure).
4. **"How do you want the company described when it matters, and what do people sometimes mistake you for that you are definitely NOT?"** → positioning + anti-positioning.
5. **"Where do you go each week to check on the business? Think: revenue numbers, customer data, your calendar, team chat, tasks, documents."** → store under "Weekly task candidates / connections" in state. (Light touch here; Phase 4 goes deep.)
6. **"What are 3 to 5 tasks you or your team do every single week that eat time? And what requests FROM other people eat your time - the asks that land on you?"** → store both for Phase 5. (Incoming-request pain - "make this look better", "status?", "find me the file" - is a different skill category from task pain, and people forget to name it unless asked.)
7. **"Anything this system must never do? Think compliance lines, tone limits, and things that should always wait for your sign-off, like sending emails or invoices."** → guardrails.

If their answers used company-specific terms (product names, internal shorthand), ask one follow-up: "You used a few terms I want to get exactly right: [list]. Give me a one-liner on each?" → glossary entries.

Then do the work:

- Write `context/company.md` (what the company is, who works there, positioning, the NOT list, guardrails).
- Write `context/offers.md` (each offer: who it's for, what it includes, price if given).
- Write `context/glossary.md` (terms + one-line definitions).
- Fill in `Home.md` with their actual domains.
- Run the placeholder pass again for `{{COMPANY_ONE_LINER}}`, `{{ICP}}`, `{{OFFER}}` (same procedure and exclusions as Phase 1). Report files touched.
- **Read their context back to them** as a tight summary and ask: "Anything wrong or missing?" Fix before moving on.
- Update state file and status page (Phase 2 done, Phase 3 current, overall 38%).

**Exit criteria:** four context files written, three business tokens replaced, owner confirmed the summary.

## Phase 3 - Voice

**Goal:** everything the system drafts sounds like them, not like AI.

1. Explain why in two sentences: "Anything I write for you should sound like you wrote it. For that I need to see real examples of your writing, the more unfiltered the better."

2. First ask: **"When your words go out in public - posts, captions, client emails - do they go out as YOU, or as the company / someone else?"** → `voice_split`. If split (their words publish under a brand or another person's name), capture THEIR personal voice now and create `content-pipeline/voice-profile/brand-voice.md` as an explicit TODO slot ("brand voice not captured yet - collect from published posts before drafting public content"). Every content skill must check WHICH voice a draft needs; a WhatsApp voice on an Instagram caption is how trust dies.

3. Ask: **"Paste 2 or 3 things you've written that sound like you. Sent emails are perfect. A LinkedIn post, a proposal paragraph, a long WhatsApp message all work. Paste them straight into this chat, or tell me where a file lives and I'll read it."**

4. Save each sample to `content-pipeline/voice-profile/sample-01.md`, `sample-02.md`, etc. (with a one-line source note at the top of each).

5. Build `content-pipeline/voice-profile/voice-guide.md` from the samples: typical sentence length and rhythm, greetings and sign-offs, words and phrases they actually use, words they'd never use, formality level, punctuation habits. Quote 2 or 3 short fragments from their samples as calibration anchors.

6. Replace the `{{VOICE_SAMPLE}}` token across the project with `content-pipeline/voice-profile/sample-01.md` (same pass procedure).

7. One more quick ask while you work: **"Do you have brand colours and fonts written down anywhere?"** If yes → replace `{{BRAND_PRIMARY}}`, `{{BRAND_NEUTRALS}}`, `{{BRAND_FONTS}}` with the real values; if no → replace them with `not set - ask the owner before any branded deliverable`, so a literal token can never reach a presentation.

8. **Run a live test.** Draft a 3-line email in their voice about something real from Phase 2. Ask: **"Does this sound like you? What's off?"** Apply their corrections to the voice guide. One iteration is usually enough; offer a second if they're not happy.

9. Update state file and status page (Phase 3 done, Phase 4 current, overall 50%).

**Exit criteria:** 2+ samples saved, voice guide written, `{{VOICE_SAMPLE}}` replaced, live test approved by the owner.

## Phase 4 - Connections

**Goal:** plug the system into the tools they already use. One connector at a time. Verify each before starting the next.

1. **Recall their Phase 2 answer** about where they go each week. Map it to the connector list and present a short plan: "Based on what you told me, here's what I suggest we connect, in order. We'll do them one at a time and test each before moving on." Then ask one question before starting: **"Who else works in these tools day to day - an assistant, a partner, a team member?"** → `team_users` in the state file. If someone shares the inbox or pipeline, give the honest current answer: this install lives in this folder on this machine; a second person can sit at it, and a second machine can pull the same system from the backup, but separate sign-ins and scoped visibility (they see the client book, not your finances) are a build-team item - written down now so it can't be forgotten. Never pretend a multi-seat mode exists.

2. **Priority order** (adjust to their actual stack). Each connector's benefit sentence is PRE-WRITTEN below - use these words or closer; never improvise the intro ("repository", "versioned", "API", "token" are banned in intro sentences):
   1. `github-backup` - "If your laptop dies tomorrow, your whole system is safe in a private cloud copy, and anything can be rolled back." Guide: `docs/connectors/github-backup.md`.
   2. `google-workspace` - "I can read your calendar and draft from your email, so 'what does my week look like' just works." Guide: `docs/connectors/google-workspace-gws.md`.
   3. `apify-youtube` - "Paste any YouTube link and I'll have read the whole video before you finish your coffee." Guide: `docs/connectors/apify-youtube.md`.
   4. `telegram-notify` - "Your phone buzzes with the result when I finish a job, even when you're away from the desk." Guide: `docs/connectors/telegram-notify.md`.
   5. Optional, only if relevant: `dropbox-rclone` ("I can see and organise your media library"), `mcp-servers` (extra tool integrations), `whatsapp-mcp` ("I can search your WhatsApp history" - the hardest connector; often better done with the build team), `higgsfield` (AI images of the owner). Guides in `docs/connectors/`. **Mention the relevant optional ones in the opening plan summary, not after an hour - past the one-hour mark everything optional gets skipped unheard.** If they ask for a connector the catalog doesn't have (social analytics is the most common ask), say so honestly and point at `docs/connectors/not-yet.md` (known gaps + workarounds); log the want in the state file.

3. **The loop, for each connector:**
   - a. One sentence on what it does for THEM, tied to their business. ("Telegram means your phone buzzes with results when I finish a research job, even when you're away from the desk.")
   - b. Ask: **"Want to set this up now, later, or skip it?"** Respect the answer. `later` → mark `deferred` and move on, no guilt.
   - c. If now: open the guide at `docs/connectors/<name>.md` and follow it. The guide splits every step into *what you do* (browser clicks, sign-ins, copying a key into the chat) and *what I do* (every command, every file edit). Walk them through their steps one at a time.
   - d. If they paste a key or token: write it into `.env` yourself, confirm "Saved. That key never leaves this folder", and never echo the key back in chat.
   - e. **Verify.** Run the guide's verification test (each guide ends with one). Show the result in plain English. A connector is only `connected` when its test passes.
   - f. Update the state file connector table (status + how verified + date) and the status page connector card.
   - g. Brief win ("That's your work backed up from now on."), then offer the next connector.
   - When Telegram is verified, record the bot token + chat id location as `{{NOTIFY_CHANNEL}}` → replace that token across the project with `.env (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID)`.

4. **Use the wait (parallel setup).** Connector setup has natural dead time: whenever the owner is off in a browser creating an account, finding a key, or waiting on a confirmation email, you work. Standing rules:
   - The moment you send them to a browser step, immediately: pre-stage the `.env` line the key will land in, pre-fill the connector's state-table row, and have the verification command ready, so the second the key arrives you save + test in one step.
   - If a verification is slow (a first sync, an install, a long fetch), start it as a background task, say "that's running in the background", and move to the NEXT connector's one-sentence intro while it finishes. Report the result the moment it lands.
   - Anything that needs no input from them (background installs, creating folders, seeding files, the GitHub backup push after the token is saved) runs in the background by default while the conversation moves forward.
   - Never make the owner watch a progress bar. If they are waiting on you for more than ~30 seconds, say what's happening in one line.

5. **Connector-specific placeholder fills** (do these as part of the relevant connector's verify step):
   - `dropbox-rclone` connected → ask where their media should canonically live (e.g. `dropbox:/{{COMPANY_NAME}} Media/`), then replace every `{{MEDIA_STORE}}` token across the project with that path. If they skip the connector, replace `{{MEDIA_STORE}}` with `local: content-pipeline/media/ (no cloud media store configured yet)` so no orphan tokens remain.
   - `google-workspace` connected AND they want generated assets auto-saved to Drive → create a "Media Hub" shared folder structure with them (Generated/, Documents/, Content Assets/), write the folder ids to `.claude/reference/media-hub-folders.json`, and replace `{{MEDIA_HUB_DRIVE_ID}}` with the root folder id. If skipped, replace `{{MEDIA_HUB_DRIVE_ID}}` with `not-configured` and note in the state file that the media-hub rule is dormant.
   - `higgsfield` connected → fill `{{OWNER_SOUL_ID}}` (and the aesthetic fields in the owner-likeness rule) per that guide. If skipped, leave the tokens and mark the connector `skipped` (the likeness rule is dormant until then).
   - End of Phase 4: run a project-wide grep for `{{` and resolve every remaining token using this default table - "defer" is only allowed for tokens whose feature is dormant AND that never load into always-on instructions:
     | Token family | If not collected by now | Why |
     |---|---|---|
     | `{{DEPLOY_TARGET}}` | replace with `none configured (local only)` | it sits in always-loaded instructions; a literal token must never survive onboarding |
     | `{{CCY}}` | replace with the Phase 2 currency, or `USD` + a note | finance skill reads it |
     | `{{BRAND_PRIMARY}}/{{BRAND_NEUTRALS}}/{{BRAND_FONTS}}` | replace with `not set - ask the owner before any branded deliverable` | stops literal tokens reaching presentations |
     | `{{FOLDER_*}}` | leave ONLY if google-workspace media hub was skipped; they live in one dormant skill | filled by the media-hub setup in its guide |
     | `{{OWNER_SOUL_ID}}` + likeness fields | leave if higgsfield skipped (dormant rule) | filled by that connector's guide |
     Log the decision per token in the state file. The grep result after this step should contain NO token outside dormant-connector files.

6. **If a connector fails:** stay calm, never blame them. Try the guide's "what can go wrong" section. If still stuck after two attempts, mark it `deferred`, add a note to "Notes for next session" in the state file, and move on. Momentum beats completeness; a deferred connector can be finished any day by saying "let's finish setting up [name]".

7. This phase can span multiple sessions. Update state after EVERY connector, not just at phase end.

8. When required connectors are connected or consciously deferred: update status page (Phase 4 done, Phase 5 current, overall 63%).

**Exit criteria:** every connector in the table is `connected`, `skipped`, or `deferred` by the owner's explicit choice; each `connected` row records a passed test.

## Phase 5 - First skills

**Goal:** turn 3 to 5 of their real weekly tasks into skills, and run each once for a genuine first win.

1. Recall the Phase 2 task list. Ask: **"Of these, which 3 to 5 would save you the most pain if they ran themselves? Pick the ones you'd want working this week."**

2. For each chosen task, in order, one at a time:
   - a. Clarify in at most 3 questions: What kicks it off? What does a good result look like? Where should the result go (a file, an email draft, a message)?
   - b. Build the skill at `.claude/skills/<kebab-case-name>/SKILL.md` with frontmatter (`name`, `description` containing the natural trigger phrases they'd actually say) and a stepwise body: inputs, steps, output location, what NOT to do (respect Phase 2 guardrails: nothing irreversible without sign-off).
   - c. **Run it once, for real,** on a live input from their business. Not a demo. Show the output.
   - d. Ask what's off. Fix the skill, not just the output. Re-run if the fix was significant.
   - e. Add a row for the new skill to `.claude/reference/skills-routing-index.md` (trigger phrases + one-line purpose) - rule 04 routes from that index, so an unrouted skill is second-class until someone notices.
   - f. If the skill writes into `clients/<name>/`, it must create `clients/<name>/STATUS.md` from a 5-line stub when missing (client, engagement, stage, channel, next step). Folders without STATUS.md are invisible to the registry and the dashboard.
   - g. Record it under "First skills built" in the state file.

3. Keep each skill small. A skill that does one task well beats a mega-skill. If a task is too big, build the first useful slice and note the rest in `memory/kanban.md`.

3b. **Before leaving this phase:** run `node scripts/generate-registry.js`. The warning list must be EMPTY (no unrouted skills, no client folders missing STATUS.md). Fix anything it names; do not graduate drift.

4. Update state file and status page (Phase 5 done, Phase 6 current, overall 75%). Celebrate properly here; this is the moment the system started doing their work.

One more default: operational outputs (briefs, status notes, summaries) bias to ONE SCREEN unless the owner asks for depth - the people receiving them read one screen max.

**Exit criteria:** 3-5 skills exist, each has run once on real input, the routing index carries them all, the registry runs clean, owner has seen and reacted to each output.

## Phase 6 - Cadence + memory bootstrap

**Goal:** decide what runs when, and seed the memory system.

1. For each new skill, ask (can be one combined question): **"Should this run on a schedule, like every weekday morning, or only when you ask?"** Record the answer at the bottom of each skill file under a `## Cadence` heading. Be upfront about the trade-off: scheduled runs need the machine on and the app open. Suggest starting everything on-demand for week one, then scheduling the proven ones.

2. Seed the task board. Ask: **"What are the top 3 things on your plate this week?"** → write to `memory/kanban.md` (This Week column). Any dates or deadlines mentioned → `memory/calendar.md`.

3. Explain the memory system in 4 sentences: everything they say gets filed immediately; people go to the people file, money to finances, ideas to the ideas backlog, commitments to the task board. They never file anything themselves. They can say "remember this:" to be explicit. They can ask "what do you know about X" anytime.

4. Run `node scripts/generate-registry.js` to build the registry of every skill and rule. Report in plain English: "I've built an index of everything the system can do: [N] skills, [N] rules. This is what keeps it self-aware as it grows."

5. Update state file and status page (Phase 6 done, Phase 7 current, overall 88%).

**Exit criteria:** cadence recorded on each new skill, kanban + calendar seeded, registry generated without errors.

## Phase 7 - Health baseline + graduation

**Goal:** a measured starting point, a week-one plan, and a clean handoff to daily use.

1. **Run the health check.** Use the `project-health` skill to score the Four C's (Context, Connections, Capabilities, Cadence) out of 10 each. Save the baseline to `memory/system_changelog.md` as a dated entry. Show the scores with one line per C, and frame low scores correctly: "Day-one scores are supposed to be low. We re-check weekly and watch them climb."

2. **Run the lint.** `node scripts/os-lint.js`. Fix anything trivial it finds (dead paths, missing frontmatter) yourself, silently. Summarize: "System check passed" or "System check found [N] small things; I fixed [N] and noted the rest."

3. **Write the week-one plan** (5 bullets, personalized from everything above) into `memory/kanban.md` and show it. Pattern: use each first skill once on a real task, tell the system one thing to remember each day, read one output critically and correct its voice, finish any deferred connector, and re-run the health check in 7 days.

4. **Graduation message.** Cover, in your own warm words:
   - Onboarding is done; from now on, just talk to it like a sharp colleague.
   - Brain dumps welcome, any length, any mess.
   - Corrections make it permanently smarter: "don't do X", "remember Y", "that doesn't sound like me" all stick.
   - **If you can't see something or don't know if it exists, just ask in the chat. It can see everything in here.**
   - Where things live: progress page in `docs/`, guides in `docs/connectors/`, the 5-minute refresher at `docs/START-HERE.md`, the visual map of the whole system at `docs/system-map.html`.

5. Final updates: state file `status: complete`, `current_phase: 7`, all phases done. Status page: all phases done, overall 100%, `<body data-complete="true">`, current focus set to "Setup complete. The system is live." Offer to open it one last time.

**Exit criteria:** baseline recorded, lint run, week-one plan on the kanban, state marked complete, status page at 100%.

---

## Recovery behaviours

- **User types a trigger phrase mid-phase:** re-read state, confirm position, continue. Never restart Phase 0 on top of existing answers.
- **State file is corrupted or half-written:** rebuild it from evidence (which context files exist, which tokens are already replaced, what `.env` contains) and confirm your reconstruction with the user in one short summary before continuing.
- **User wants to skip a phase:** allowed, except Phase 1 (identity tokens gate everything else). Mark it `skipped` in the phase log and tell them the sentence that resumes it later ("run the voice setup").
- **User asks an unrelated question mid-onboarding:** answer it properly, then offer: "Want to get back to setup? We were on [phase]."
