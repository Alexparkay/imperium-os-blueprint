---
name: youtube-algorithm
description: "Authoritative answer engine for YouTube algorithm and strategy questions. Use when the owner asks ANY technical question about how YouTube works - algorithm mechanics, posting strategy, title/thumbnail timing, A/B testing, retention, watch time, packaging, repurposing, duplicate uploads, niche pivots, channel persona, Shorts vs long-form, what affects reach, what kills a channel, anything funnel-hacking the algorithm. Triggers on phrases like 'YouTube algorithm', 'how does YouTube work', 'should I post', 'will this affect reach', 'YouTube strategy', 'thumbnail', 'title change', 'repost', 'duplicate', 'repurpose', 'channel persona', 'A/B test'. Always pulls fresh real-time data via WebSearch - never answers from stored knowledge alone. Outputs verified-source-cited answer with self-evaluated quality score 1-10."
type: skill
status: active
created: 2026-05-03
updated: 2026-06-11
---

# YouTube Algorithm - Authoritative Answer Engine

## Purpose

The owner needs reliable, up-to-date answers on YouTube algorithm questions. The platform changes monthly. Skill files go stale. Training data is worse. This skill defines the WORKFLOW for answering these questions reliably, not a static knowledge dump.

**Hard rule:** Every answer must cite at least one source from the last 90 days, fetched in the current session. No exceptions. The research-before-claims rule is in force.

## When This Triggers

ANY question that asks how YouTube works, how to post, what affects reach, or how to game the algorithm. Examples:

- "Does the title and thumbnail matter at the initial push?"
- "If I change the thumbnail later, does it reset?"
- "If I repost a video on a different channel, will it get flagged?"
- "Can I split this 60-min recording into chunks?"
- "Should I post Shorts and long-form on the same channel?"
- "How long does the algorithm test a new video?"
- "What kills a channel's reach?"
- "Is there a small-channel boost?"
- "Should I pivot niche or start fresh?"
- "What's the current best practice for X?"

If you are not sure whether to invoke, invoke. The cost of running this skill is 5 minutes. The cost of giving a stale answer is a wrong strategic decision.

## The 6-Step Workflow (Always Run In Order)

### Step 1 - Check existing research freshness

Read `research/youtube-algorithm-*.md` if any exist (foundation report + sub-question reports). On the FIRST invocation in a fresh install, none exist yet: run a full Step 2 research pass and save the result as `research/youtube-algorithm-YYYY-MM.md` - that becomes the foundation report. If the foundation report is older than 30 days OR the specific question is new, proceed to Step 2. If a recent (within 30 days) report already covers the exact question with sourced data, you can cite it as starting context - but still run Step 2 to check for newer information.

### Step 2 - Live WebSearch with tier priority

Run WebSearch for the specific question with date-restricted queries. Priority order for sources:

**Tier 1 (always check first):**
- YouTube Help (`support.google.com/youtube`)
- YouTube Creator Insider (videos, blog posts)
- YouTube Official Blog
- Direct quotes from YouTube engineers and product leads (e.g. Todd Beaupré, Rene Ritchie)
- Google's official policy docs

**Tier 2 (named strategists with track records):**
- Paddy Galloway
- Colin and Samir
- Ed Lawrence (Film Booth)
- Spotter Studio team
- MrBeast public statements

**Tier 3 (analysis platforms, treat as hypothesis):**
- VidIQ, TubeBuddy, Backlinko
- Search Engine Journal
- ThumbnailTest, FeedHive, TubeRanker
- Cross-check Tier 3 claims against Tier 1/2 before treating as fact

**Tier 4 (skip):** Generic SEO blogs, content farms, anything cited-from-cited-from. If the chain breaks, don't use it.

### Step 3 - Verify the claim chain

For every empirical claim in your answer, trace it back to a Tier 1 or Tier 2 source. If the claim only appears in Tier 3 sources, label it "[Tier 3 inference]" rather than presenting it as fact. Conflicting signals between sources = surface them, don't pick one and pretend.

### Step 4 - Apply the verified facts file

The foundation report (`research/youtube-algorithm-YYYY-MM.md`) holds the load-bearing facts with sources. Reference it for context but never quote it without checking the underlying source URL is still valid.

### Step 5 - Output answer

Format:

```
## TL;DR
[1-3 bullets, the practical answer]

## Why
[Mechanism - what's happening algorithmically, with sources inline]

## What this means for the owner specifically
[Apply to their situation: channel size, brand positioning, ICP, time budget - pull from context/ and memory/content/]

## Risks / counter-arguments
[Steelman the opposite. The contrarian-default rule applies.]

## Sources
[Inline as you go, full list at end with date fetched]
```

### Step 6 - Self-evaluate score 1-10

After every answer, score it on these 5 dimensions and report the score in the output:

1. **Source freshness** - Is at least one source from the last 90 days? Tier 1 source cited?
2. **Source quality** - Tier 1 / 2 dominant? Or Tier 3 with cross-checks?
3. **Specificity to the owner** - Does the answer apply their actual situation, not generic advice?
4. **Contrarian rigor** - Were counter-arguments surfaced before agreement?
5. **Practical actionability** - Does the owner know what to DO after reading?

Each dimension scored 1-10. Avg ≥9 = ship. Below 9 = identify the weakest dimension, fix, re-score (max 3 iterations per the quality-gate rule).

## Verified Facts Seed (with staleness dates)

These are load-bearing facts as of 2026-05-03 from the parent OS's foundation research. Use as starting context ONLY. Re-verify any fact older than 30 days before citing - by the time you read this, most need re-verification.

### Algorithm fundamentals (verified 2026-05-03)
- **Discovery is video-level**, not channel-level. Beaupré on record: "the algorithm for Discovery is focused more on individual videos." [Source: SEJ March 2024]
- **Pull-based, not push-based.** YouTube serves content to viewers based on what makes them happy, not what creators want pushed.
- **Test audience layers (in order):** Core Audience → Recent Viewers → Topic Matches → Adjacent Audiences. [VidIQ Nov 2025]
- **Initial test window:** 4-24 hours. Strongest signals lock in within first 1,000 impressions. [Various Tier 3, 2025-2026]
- **Satisfaction beats watch time.** Post-watch surveys, return visits, session continuation now sit above raw AVD. [VidIQ Nov 2025; OutlierKit 2026]

### CTR and AVD benchmarks (verified 2026-05-03)
- CTR < 2% effectively dead. 4-8% gets tested further. 10%+ heavy promotion.
- AVD < 30% penalised. 40-60% good. 60%+ excellent.

### Recent shifts (verified 2026-05-03)
- **December 4, 2025:** Native title A/B testing rolled out globally, joining thumbnail A/B testing. [SEJ]
- **December 21, 2025:** Browse feed cut long-form recommendations ~80% in favor of Shorts. [Joos via ppc.land]
- **February 2026:** Browse personalisation overhaul rewards niche specificity over broad appeal.
- **January 2026:** Session Contribution weight raised. Videos that end sessions get suppressed.
- **July 15, 2025:** "Repetitious content" policy renamed to "inauthentic content," AI-generated and templated material targeted. [Music Ally]

### A/B test mechanics (verified 2026-05-03)
- **Up to 3 variants** for titles, thumbnails, or combos.
- **Winner metric = watch time per impression**, NOT CTR. YouTube's exact wording confirms this. [YouTube Help]
- **Up to 2 weeks** test duration.
- **Desktop only, long-form only, advanced features required.**
- **Mid-test edits abort the test.**
- **Low-impression channels often get "inconclusive."**

### Repurposing rules (verified 2026-05-03)
- **Same video on second channel** = inauthentic content, demonetisation risk. Substantial transformation required.
- **Raw chunks of long-form** = inauthentic content risk. Transformed clips with new framing = safe.
- **Best practice for long-form repurposing:** 1 full episode + 3-5 Shorts (45-60s, linked to full) + 2-3 transformed highlight clips on clips channel or main with fresh thumbnails and edits.
- **Long-form (30+ min)** was being promoted 35-45% MORE in 2025 vs 2024. Don't fragment for the algorithm. [Hashmeta 2025]

### Title/thumbnail timing (verified 2026-05-03)
- Post-publish edits **do NOT reset views, watch time, retention.** Algorithm rides forward signal, viewer behavior toward new packaging re-weights distribution.
- **Wait 24-48 hours after publish** before changing. Change one element at a time.
- **Old back-catalog videos with low CTR** = highest-leverage place to iterate. Paddy Galloway's Tim Gabe case: 40x daily views from a thumbnail swap. [Paddy via Colin & Samir]
- **Ship optimized AND set up native A/B test from day 1.** Don't ship deliberate baseline expecting to iterate - packaging is highest-leverage pre-publish work. [Paddy + Spotter Studio]

## Skill Self-Improvement Loop

After every invocation, do these four updates BEFORE closing the response. They take 2 minutes total. Skipping them = the skill goes stale and starts giving wrong answers.

1. **Append new findings to research file.** If WebSearch surfaced a new fact, source URL, or counter-example not already in the foundation report or a question-specific report, append a dated entry: `### YYYY-MM-DD update - [topic]\n- [finding] [Source: URL, fetched YYYY-MM-DD]`. Don't rewrite the report; append to a "Living Updates" section at the bottom.

2. **Reconcile contradictions in the verified facts seed.** If a claim in the "Verified Facts Seed" section above is contradicted by new sourced data, edit the fact in place. Add the original date in parentheses + the new date + the new source URL. Example: `~~Old fact (verified 2026-05-03)~~ → New fact (updated YYYY-MM-DD, [Source: URL])`. Never silently overwrite - preserve the audit trail.

3. **Expand trigger phrases.** If the owner's question used a phrasing not already in "When This Triggers," add it. The next session benefits.

4. **Log the self-eval score.** Append `<score>/10 - <one-line summary> - YYYY-MM-DD` to the "Score Log" section at the bottom of this file. If three consecutive scores fall below 9 on the same question type, the verified facts seed is stale on that topic - flag it explicitly as "[NEEDS DEEP REFRESH]" in the relevant section.

The skill is a living document. Every invocation should leave it slightly more accurate than before, not less. Treat the verified facts seed as a working hypothesis that gets revised on contact with new evidence.

## Score Log

(Append `<score>/10 - <summary> - YYYY-MM-DD` after each invocation)

## Reference Files

- **Foundation research:** `research/youtube-algorithm-YYYY-MM.md` (created on first invocation)
- **Question-specific research:** `research/youtube-algorithm-questions-*.md` (numbered as added)
- **The owner's channel context:** `memory/business/personal_brand.md` + `memory/content/` strategy docs (channel goals, ICP, time budget)

## What This Skill Does NOT Do

- Generate video scripts (use `content-pipeline`)
- Score video concepts pre-publish (use `video-score` skill)
- Audit the owner's channel performance (use YouTube Studio or build a separate analytics workflow)
- Replace the YouTube automation (`automations/youtube/`) for transcript pulls
- Make brand decisions (that's a strategy session)

## Trigger Confidence

When the owner asks a question that could conceivably be a YouTube strategy question, INVOKE THIS SKILL. The cost of false-positive invocation is small (5-15 min of research). The cost of false-negative is a stale answer that loses the owner weeks of bad strategy. Default to invoke.
