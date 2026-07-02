---
name: content-cascade
description: "One-command repurposing - takes a published YouTube video (or any long-form content) and cascades it into blog post, LinkedIn post, X/Twitter thread, newsletter edition, and 3 short-form scripts. All in the owner's voice, all ICP-first. Use when the owner says \"cascade this\", \"repurpose this video\", \"distribute this\", \"content from this video\", or after publishing any YouTube video."
metadata:
  title: Content Cascade - 1 Video → 7 Assets
  tags:
    - "system"
  type: skill
  status: active
  created: 2026-04-02
  updated: 2026-06-11
---

# Content Cascade - 1 Video → 7 Assets

You are the owner's content distribution engine. One long-form piece becomes 7 platform-specific assets in one pass. Every output speaks to the ICP ({{ICP}}) - never narrow to one sub-segment unless the owner says so.

## Context Files (Read Before Starting)

1. `content-pipeline/voice-profile/` - Voice standards (MANDATORY; built during onboarding Phase 3)
2. `memory/content/` strategy docs - the owner's golden rules (ICP-first formats, what to avoid)
3. `context/company.md` + `context/offers.md` - ICP and offer context
4. `.claude/skills/voice-check/SKILL.md` - Banned words, scoring (SINGLE SOURCE OF TRUTH)

## Input

Either:
- A YouTube URL (transcribe first: `cd automations/youtube && node transcripts.js "<url>"`)
- A transcript file path
- A content brief or research output

## The Cascade

### Step 1: Extract Core Intel

From the source material, extract:
- **3 key insights** - the most valuable, non-obvious takeaways for the ICP
- **1 contrarian angle** - what's different about this perspective vs what's already out there
- **Data points** - specific numbers, stats, benchmarks (odd numbers > round numbers)
- **Named frameworks** - any branded IP or named concepts worth repeating
- **The one sentence** - if this entire piece were one sentence for a typical ICP member, what is it?

### Step 2: Blog Post (SEO-Forward)

**Target:** 1,200-1,800 words | **Save to:** `content-pipeline/drafts/blog/`

Structure:
1. **Title** - Primary keyword + specific number. Under 60 chars.
2. **Meta description** - 155 chars, answer-first, includes keyword
3. **TL;DR box** - 2-3 sentences. The whole article compressed.
4. **Opening** - Documentary-style story opener (specific person, specific moment, THEN thesis). NOT "In this article we explore..."
5. **Body** - H2s with clear benefit framing. One specific number per section. Written for the reader who delegates, not the one who tinkers.
6. **Embedded video** - YouTube iframe of the original video
7. **Key Takeaways** - 3-5 bulleted, actionable points
8. **CTA** - Relevant free tool, newsletter signup, or call booking

Rules:
- No jargon. Outcome language, not implementation language.
- Every H2 must pass: "Would the ICP keep reading after this heading?"
- Internal links to 2-3 related posts if they exist
- SEO: primary keyword in title, first 100 words, one H2, and meta description

### Step 3: LinkedIn Post

**Target:** 150-250 words | **Save to:** `content-pipeline/drafts/linkedin/`

Structure:
1. **Hook line** - One sentence that stops the scroll. Specific number or contrarian take.
2. **3-5 short paragraphs** - One idea each. Short sentences. The ICP's language.
3. **Soft CTA** - "Full breakdown on the channel" or "Link in comments"

Rules:
- NO hashtags in the body. 3-5 hashtags at the very end only.
- NO em dashes. Period. Full stop. Colon at most.
- Speak to the buyer, not the practitioner community
- One insight from the source, reframed for LinkedIn
- Must pass: "Would a CEO repost this?"

### Step 4: X/Twitter Thread

**Target:** 7-10 tweets | **Save to:** `content-pipeline/drafts/twitter/`

Structure:
1. **Tweet 1 (Hook)** - Contrarian take or surprising stat. Must work standalone.
2. **Tweets 2-8** - One idea per tweet. Each stands alone AND flows as thread.
3. **Tweet 9 (CTA)** - Link to full video
4. **Tweet 10 (Bookmark bait)** - "Save this if you [ICP qualifier]"

Rules:
- Each tweet under 280 chars
- No thread numbering (1/10, 2/10)
- Hot take angle - what would make someone quote-tweet this?
- Include 1-2 specific numbers across the thread

### Step 5: Newsletter Edition

**Target:** 400-700 words | **Save to:** `content-pipeline/drafts/newsletter/`

Structure:
1. **Subject line** - Curiosity gap + specificity. Under 50 chars.
2. **Preview text** - Extends the curiosity
3. **Opening** - Personal, conversational, one short paragraph
4. **The insight** - One key takeaway with a specific example
5. **The tactical bit** - What can they do with this? 3 bullet points.
6. **CTA** - Watch the full video / reply / download free tool

Rules:
- Write like a DM to a smart friend, not a publication
- One topic per edition. Don't cover everything from the video.
- The newsletter makes them want to WATCH the video, not replace it

### Step 6: Short-Form Scripts (x3)

**Save to:** `content-pipeline/drafts/short-form/`

**30-Second (Hook + One Insight)**
```
HOOK (0-5s): [Spoken hook + visual hook]
INSIGHT (5-25s): [One killer data point or reframe]
CTA (25-30s): [Follow / full video link]
TEXT OVERLAY: [What appears on screen - must work with sound OFF]
VISUAL: [Talking head / screen recording / diagram / B-roll]
```

**60-Second (Hook + Problem + Solution)**
```
HOOK (0-5s): [Spoken hook + visual hook]
PROBLEM (5-20s): [Agitate ICP pain - specific to their world]
SOLUTION (20-50s): [The insight, with one number]
CTA (50-60s): [Follow / full video link]
TEXT OVERLAY: [Key phrases on screen]
VISUAL: [Direction for each beat]
```

**90-Second (Hook + Story + Insight + Reframe)**
```
HOOK (0-5s): [Spoken hook + visual hook]
STORY (5-30s): [Micro-story - a real person, a specific situation]
INSIGHT (30-60s): [What changed / what we found]
REFRAME (60-80s): [Why this matters for YOUR business]
CTA (80-90s): [Follow / full video link]
TEXT OVERLAY: [Key phrases]
VISUAL: [Direction for each beat]
```

Rules for all short-form:
- Hook must work with sound OFF (text overlay carries it)
- Filmable by one person (no multi-camera, no guests required)
- Speak to the viewer directly: "your business", "your team", "your revenue"
- No jargon. No tool names (unless the ICP cares about tools). Outcomes only.

### Step 7: Voice Check (ALL Outputs)

Run every output through:
1. Zero em dashes?
2. Zero banned words? (check `.claude/skills/voice-check/SKILL.md`)
3. Would the senior ICP segment understand every sentence?
4. Would the hands-on ICP segment find it actionable?
5. Anti-slop rule: no forced negation, no staccato repetition, no bloated paragraphs?
6. Compression test: can any paragraph be one sentence? Compress it.

Score each output 1-10. Rewrite anything below 8.

### Step 8: Save & Log

Save all outputs to their respective folders. Log to `memory/content/publishing_log.md`:
```
Date: [YYYY-MM-DD]
Source: [YouTube URL or content brief]
Cascaded to: Blog, LinkedIn, X, Newsletter, 3x Short-form
Voice scores: Blog [X], LinkedIn [X], X [X], Newsletter [X], Short-form [X/X/X]
```

## Output Summary

After cascade, present:
```
CASCADE COMPLETE
Source: [title / URL]
Assets: 7
├── Blog: [title] - [word count] words - Voice: [X]/10
├── LinkedIn: [hook preview] - [word count] words - Voice: [X]/10
├── X/Twitter: [tweet count] tweets - Voice: [X]/10
├── Newsletter: [subject line] - [word count] words - Voice: [X]/10
├── Short 30s: [hook preview] - Voice: [X]/10
├── Short 60s: [hook preview] - Voice: [X]/10
└── Short 90s: [hook preview] - Voice: [X]/10

Next: Review each asset → approve → publish via the owner's publishing stack.
```

---

## Related

- [[voice-check]]
- [[competitive-ideation]]
- [[trend-intelligence]]
- [[quality-gate]]
