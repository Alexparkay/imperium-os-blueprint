# Phase 0 - Welcome + tour + org detect

**Goal:** they understand what they have and how to talk to it; you know what KIND of install this is; the install path is set.

## 1. Org detect (before you say a word)

Check two things:

- Is `ORG_CONTEXT_REPO` set in the root `.env`? (Equivalent check: `node scripts/org-sync.js --status` reports a repo URL.)
- Does `context/org/company.md` contain real content? Template-fresh means: frontmatter still says `status: template`, or the file still contains `{{COMPANY_NAME}}`-style tokens. Real content means a filled company name and one-liner.

**If either says the org layer is already filled** (an install team pre-loaded it, or the org repo is wired): this seat is **joining an existing org**. Record `org_mode: org-joining` for the state file, and greet accordingly - this is the "click into place" moment:

> Welcome. Good news: I already know [company]. The company context came pre-loaded - what [company] does, the departments, the vocabulary, the offers. So this hour is about YOU: your seat, your voice, your tools. By the end, I'll know your corner of [company] as well as I know the company itself.

**If the org files are template-fresh and no org repo is set:** record `org_mode: solo-or-first-seat` (Phase 1 works out which) and use the standard welcome below.

## 2. The welcome (standard path - adapt, don't paste robotically)

> Welcome. You've just installed an AI operating system for your company. Here's the whole mental model: there's a chat (this), a memory (a set of folders that hold everything I learn about your business), and skills (pre-built workflows I run when you ask). You talk to me in plain English and I do the technical work. You never need to open a terminal, and you can't break anything by talking to me.

## 3. The 60-second tour, one line per folder

- `context/` is the one-page truth about your company and your seat. I read it at the start of every session.
- `memory/` is where everything you tell me lands: people, decisions, deadlines, ideas.
- `clients/` gets one folder per client engagement.
- `content-pipeline/` holds drafts, published work, and your voice profile.
- `automations/` holds the running tools, like video research and phone notifications.
- `dashboard/` is where your live company dashboard will eventually live.
- `docs/` holds the guides and your setup progress page.

On the org-joining path, add one line: "The company files in `context/org/` are shared with every seat at [company] - I read them, and when something in them needs changing I send the correction upward rather than editing them here."

## 4. How to talk to it

Full sentences, half sentences, voice-dictated rambles, all fine. Multiple topics in one message, fine. It will sort the pieces out. Mention there's a one-page visual of how everything fits together at `docs/system-map.html`; offer to open it now or note it for later (don't push, the tour already covered the essentials).

## 5. Detect the install path

Run `pwd` (or read the workspace root). Search the project for the literal text `{{REPO_PATH}}` and replace every occurrence with the detected absolute path (forward slashes), EXCLUDING the files that document the token itself: `docs/ONBOARDING-FLOW.md` and this skill's directory (`.claude/skills/start-onboarding/`). Note the files touched; you'll report them with the Phase 1 pass.

## 6. Start the slow work now, in the background

Kick off `npm install` inside `automations/youtube/` as a background task (the only module onboarding needs installed; `automations/worker/` also has dependencies but is install-team scope and stays dormant). Don't narrate it; by the time Phase 4 needs it, it's done. If it fails, note it in the state file and retry during Phase 4.

## 7. Create the state file

Create `memory/onboarding-state.md` from the template in SKILL.md, with phase 0 marked done, `current_phase: 1`, and `org_mode` set to what step 1 found (`org-joining` or `solo-or-first-seat`).

**Capture the registry baseline:** run `node scripts/generate-registry.js` once and copy any `WARN:` lines it prints into the state file's "## Registry baseline (pre-install warnings)" section (write "(none)" if clean). These are machine-environment warnings the install didn't cause and usually can't fix from inside this folder (e.g. rule files that differ from a user-global `~/.claude/rules/` copy on this machine). The Phase 5 gate compares against this list: only NEW warnings block.

## 8. Update the status page

Phase 0 done, Phase 1 current, overall 13%. If org-joining, set the org-mode indicator (`#org-mode`) to "Org seat - shared company truth" now; otherwise leave it for Phase 1 to resolve. Offer to open the page in their browser.

## 9. Ask the one Phase 0 question

**"Ready to set this up around you? It takes about an hour, and you can stop anytime and pick up where you left off. Shall we start?"**

**Exit criteria:** org mode detected and recorded, state file exists, status page updated, user said yes.
