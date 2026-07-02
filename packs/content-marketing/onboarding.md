---
title: Content & Marketing pack - onboarding questions
type: onboarding-branch
pack: content-marketing
---

# Installing the content-marketing pack: what to ask

Asked by onboarding Phase 5 (or any later session) when this pack is installed. One question at a time, same tone rules as the main onboarding. Record answers in `memory/onboarding-state.md` under a `## Pack: content-marketing` heading, and route them to the files named below.

1. **"Which channels are actually in play for you - YouTube, LinkedIn, a newsletter, a podcast, short-form? Name only the ones you'll publish on in the next 90 days."**
   → Store as the channel list. Skills for channels NOT in play stay installed but dormant; don't offer them proactively.

2. **"What's your publishing cadence, per channel? Rough is fine - 'one video a week, LinkedIn three times' beats a fantasy calendar."**
   → `memory/content/` (create `memory/content/publishing-cadence.md` if absent). The weekly pulse checks against this.

3. **"Who approves content before it goes out - you, someone else, or nobody?"**
   → If anyone: nothing publishes without their sign-off; record the name in `memory/people.md` and the guardrail in `context/org/company.md`. If nobody: confirm the standing rule that drafts still wait in `content-pipeline/drafts/` for an explicit "ship it".

4. **"Where does your brand voice live - is the voice profile we built during setup the voice for ALL of this, or does some content go out under a different voice (a brand account, a ghostwritten exec)?"**
   → If split: create/point at `content-pipeline/voice-profile/brand-voice.md` and note WHICH channels use which voice. Every skill in this pack loads the voice profile before drafting; a wrong-voice draft is a failed draft.

5. **"Which 3 to 5 YouTube channels should I treat as your competitor set - the channels closest to what you make and who you make it for? Handles or channel names, rough is fine."** (Skip if YouTube isn't in their channel list from question 1, or if they're not sure yet.)
   → Write the handles into the "Competitor channels" list in the installed `video-score` skill (`.claude/skills/video-score/SKILL.md`), replacing its five placeholder tokens; fewer than five answers is fine - delete the unused lines. Leave the pack source copy (`packs/content-marketing/skills/video-score/`) untouched: it's the reinstall template. **If skipped:** the tokens stay and `video-score` collects the list on its first real run (that fallback is written into the skill itself).

After the answers: run ONE pack skill on a real input (score a real video idea with `video-score`, or cascade one existing piece with `content-cascade`) so the owner sees the pack working before the session ends.
