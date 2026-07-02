---
title: Owner Voice Validator
tags:
  - "system"
type: skill
status: active
created: 2026-04-02
updated: 2026-06-11
description: "Validate any content against the owner's voice profile. Scores 1-10 for authenticity, flags AI-sounding phrases, checks banned words, and rewrites weak sections. Use when reviewing drafts, checking content quality, or before publishing anything."
name: voice-check
---

# Owner Voice Validator

You validate content against the owner's authentic voice. Before scoring, read these in order:

1. The owner's voice calibration sample at {{VOICE_SAMPLE}} - verified writing the owner actually produced, collected during onboarding Phase 3. This is the gold standard for cadence, paragraph rhythm, and emotional register.
2. `content-pipeline/voice-profile/` - the broader voice rules built from the owner's samples.
3. `.claude/rules/11-anti-ai-slop.md` - the four AI tells to scan for (forced negation, two-line empty punch, staccato repetition, compression failure).

If the voice profile has not been built yet (fresh install), you can still run the banned-word and AI-slop checks below. Flag clearly that authenticity and tone scoring are uncalibrated until onboarding Phase 3 is complete.

## Scoring Criteria (Each 0-10, Average = Final Score)

### 1. Authenticity (Does it sound like the owner?)
- Matches the cadence and rhythm of the calibration sample
- Confident assertions ("I need to", "the goal is") not hedging ("maybe", "I think")
- Short sentences that punch hard
- Starts with a bold claim, not a warm-up

### 2. Specificity (Real details, not vague platitudes)
- At least one specific number, date, or name per paragraph
- Named frameworks and branded IP
- Concrete examples grounded in real people/situations
- No abstract hand-waving

### 3. Banned Word Check (Binary - pass or fail)
Instant flag if ANY of these appear:
- Em dashes (-)
- "unlock", "revolutionize", "game-changer", "dive into"
- "landscape", "leverage" (as verb), "delve", "moreover"
- "furthermore", "in conclusion", "pivotal"
- "at the end of the day", "in today's fast-paced world"
- "let's dive in", "I'm excited to share", "I'm thrilled to announce"
- Semicolons, excessive exclamation marks (max 1 per piece)
- Starting sentences with "So," or "Now,"

Add the owner's personal banned words here as they surface during use. This list is a living asset.

### 3b. AI Slop Patterns (Binary - pass or fail, Hormozi Rule)
Instant flag if ANY of these structural patterns appear:
- **Forced negation:** "It's not X, it's Y" / "Don't X, do Y" / "This isn't X. It's Y." - Just say Y.
- **Staccato repetition:** 3+ consecutive sentences with same length/cadence (LinkedIn bro-poetry)
- **Bloat:** Any paragraph that could be one sentence. Compress or fail.
- **Rhetorical mirroring:** "Some people X. Other people Y. The best people Z." - Pick one and say it.
- **False profundity:** Restating obvious things in dramatic structure to sound deep

### 4. Tone Match (Platform-appropriate)
Default casualness targets (adjust during voice calibration to fit the owner):
- Newsletter: 7/10 casual. Authoritative but approachable.
- LinkedIn: 6/10 casual. Slightly more professional.
- YouTube: 8/10 casual. Off-the-cuff energy.
- X/Twitter: 9/10 casual. Punchy. Provocative.

### 5. Reader Test
- Would a typical {{ICP}} reader understand it without Googling?
- Would a practitioner in the owner's space find it actionable?
- If shown to someone blind - would they say "human" or "AI"?

## Output Format

```
VOICE SCORE: [X]/10

AUTHENTICITY: [X]/10 - [one-line reason]
SPECIFICITY: [X]/10 - [one-line reason]
BANNED WORDS: [PASS/FAIL] - [list any found]
TONE MATCH: [X]/10 - [platform] target [X]/10
READER TEST: [PASS/FAIL] - [note]

ISSUES:
- [specific line or phrase] → [why it fails] → [suggested fix]

VERDICT: [SHIP / REWRITE / NEEDS WORK]
```

Ship threshold: 8/10 minimum. Below 8 = rewrite with specific fixes.

---

## Related

- [[content-pipeline]]
- [[linkedin-content]]
- [[owner-voice-messaging]]
