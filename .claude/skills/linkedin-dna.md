---
title: LinkedIn Creator DNA Analyzer
tags:
  - "system"
type: skill
status: active
created: 2026-04-02
updated: 2026-06-11
description: "Comprehensive LinkedIn creator DNA analysis - scrapes a creator's full profile, 50+ posts, comments, engagement, funnel, and audience demographics via Playwright, then produces a 1,000+ line intelligence profile mapping what makes them successful to the owner's goals. Use when the owner says \"LinkedIn DNA\", \"analyze [creator] LinkedIn\", \"LinkedIn profile analysis\", \"scrape LinkedIn\", \"LinkedIn breakdown\", \"study [creator] on LinkedIn\", \"LinkedIn deep dive on [creator]\", any LinkedIn URL with intent to analyze the creator, or \"do a DNA on [name]\". If the task is writing a LinkedIn POST (not analyzing a creator), use the linkedin-content skill instead."
name: linkedin-dna
---

# LinkedIn Creator DNA Analyzer

You extract a forensic-level intelligence profile from any LinkedIn creator. The output is a 1,000+ line markdown document that breaks down exactly what makes them successful - their hooks, structure, visuals, engagement patterns, funnel, audience demographics, and reply strategy - then maps every actionable pattern to the owner's ICPs, pillars, and voice.

## Before You Start

Read these files to understand the owner's context:

1. `content-pipeline/voice-profile/` - the owner's voice (for the "What to STEAL" section)
2. `memory/content/` - the owner's ICP profiles, content pillars, and persona rules

**Reference example:** the first DNA profile you produce becomes the in-house quality benchmark, stored at `content-pipeline/research/creator-bank/`. Until one exists, hold yourself to the quality standards below (minimum 1,000 lines, every claim data-backed).

## Input

The owner provides a LinkedIn profile URL like `https://www.linkedin.com/in/{slug}/`.

Extract the `{slug}` from the URL. This becomes the filename prefix for all outputs.

## Execution - The 10 Phases

1. **Profile Scrape** - Navigate to the profile via Playwright. Extract headline, about, featured, experience, education, followers, verified status, "People Also Viewed" sidebar. Save to `content-pipeline/research/creator-bank/data/{slug}_profile.json`.

2. **Post Scrape** - Navigate to `/recent-activity/all/`. Scroll 20+ times to load 50+ posts. Extract text, reactions, comments, media type for each using `[data-urn]` elements. Save to `content-pipeline/research/creator-bank/data/{slug}_posts.json`. Take 2-3 feed screenshots for visual verification.

3. **Deep-Dive Top 5 Posts** - Navigate to each top post individually. Extract reposts (only visible on individual post pages). Scrape 15-30 comments per post including commenter names + headlines from `a[href*="/in/"]` links. Confirm media type via screenshot. Calculate repost ratio.

4. **Funnel Analysis** - Visit every URL in the featured section and post CTAs. Map the full funnel: landing page → capture → nurture → paid offer.

5. **Engagement Benchmarking** - Web search for current-year LinkedIn benchmarks. Compare the creator's metrics against current tier data from independent benchmark publishers.

6. **Content Analysis** - From scraped data: categorize hooks (8 types), analyze post structure (word count, whitespace, lists), map topic clusters, analyze sentence rhythm, identify vocabulary patterns.

7. **Cross-Platform Synergy** - If a newsletter or YouTube DNA exists in `content-pipeline/research/creator-bank/`, compare patterns across platforms.

8. **Synthesis** - Map every pattern to the owner's ICPs, pillars, and voice. Separate "What to STEAL" from "What to AVOID."

9. **Write DNA Profile** - Produce the markdown file with 16 sections + 5 appendices (see Required Sections below).

10. **Save, Commit, Push** - Save all files, commit with a descriptive message, push to the remote.

## Technical Notes (LinkedIn Scraping Gotchas)

These are hard-won lessons - they will save you hours of debugging:

- **Post elements use `[data-urn]` attributes**, not permalink anchors. Extract activity IDs with regex: `urn.match(/activity:(\d+)/)`
- **Media misclassification is the #1 problem.** LinkedIn's DOM causes: carousel documents → detected as "single-image" (only cover slide loaded); pure text posts → detected as "single-image" (og:image metadata). Always verify with screenshots.
- **`hasDocumentClass` detection:** Check if the post element's innerHTML contains "document" or "Document". Posts with `hasDocumentClass=true` AND `imageCount=0` are carousel documents.
- **Reposts only appear on individual post pages**, not in the activity feed. You must navigate to each post URL to get repost counts.
- **Comments require interaction.** Scroll to the comments section, then click "Load more comments" (`.comments-comments-list__load-more-comments-button`).
- **Commenter names + headlines** are embedded in the `a[href*="/in/"]` link text within the comments section. The headline appears after `\n` in the link text.
- **LinkedIn's document viewer uses iframes** that Playwright cannot navigate into. You can see the cover slide but not interior slides (2-10). Acknowledge this limitation.

## Required Sections (minimum 16 + 5 appendices)

1. Profile Positioning (headline formula, about section architecture, featured, experience, "People Also Viewed")
2. Post Hook Patterns (categorize every hook, rank by engagement, top 10 hooks table)
3. Post Structure & Formatting (word count stats, whitespace ratio, list frequency, separator usage)
4. Visual & Carousel Strategy (corrected media classification with visual verification, design style)
5. Content Mix (% breakdown by format, engagement differential by format)
6. Engagement Patterns (avg metrics, top 10 posts, bottom 5, virality drivers, reaction vs comment patterns)
7. Engagement Benchmarking (current independent benchmarks, honest tier assessment)
8. CTA Patterns (formula, destinations, countdown drips, link tracking)
9. Hashtag Strategy
10. Topic Clusters (distribution, performance vs mean, through-line themes, named frameworks)
11. Posting Cadence (frequency, consistency, content recycling signals)
12. Lead Magnet Funnel Analysis (landing page breakdown, post-signup flow, full funnel diagram, product tiers)
13. Comment Engagement (quality analysis with real examples, creator's reply pattern, notable interactions)
13a. Audience Demographics (commenter role breakdown table, key insights, ICP alignment analysis)
14. Cross-Platform Synergy (if newsletter/YouTube DNA exists - comparison table)
15. What to STEAL for the owner (mapped to ICPs, pillars, voice - with specific adapted examples)
16. What to AVOID (patterns that only work at their scale, conflict with the owner's positioning, or would look derivative)

**Appendices:**
A. Engagement Distribution (histogram)
B. Structural Templates (5-6 templates derived from the creator's patterns)
C. Complete Hook Index (every post's hook + engagement + media type)
D. Key Vocabulary & Phrases (most/least frequent words, signature phrases, banned words)
E. Analysis Methodology & Limitations (data sources, scraper limitations, sample sizes)

## Reliability Protocol (MANDATORY - prevents known errors)

These rules come from verified failures in past analyses. Follow every one.

1. **50+ unique posts minimum.** Scroll 30+ iterations with 2s pauses. Deduplicate by first 80 chars of hook. Do NOT write the DNA until you hit 50. If under 50, the creator doesn't post enough - note in limitations.

2. **Verify engagement numbers.** LinkedIn embeds "Feed post number X" labels that parsers mistake for reaction counts. After extracting, sanity-check: top posts for a 100K+ account should have 500+ reactions, not single digits. Reactions are standalone numbers; comments/reposts have text labels.

3. **Verify the correct profile.** LinkedIn slugs can be misleading (similar slugs belong to different people). Always check: headline matches, follower count is reasonable, "People Also Viewed" makes sense.

4. **CTA rate: only count real CTAs.** URL/link, "sign up", "subscribe", "check out [product]". Do NOT count podcast mentions, company references, or "follow me." Past error: 36% claimed vs 8% actual.

5. **Always include Personal/Life content as a category.** Past error: personal content (22% of posts) was invisible because all posts were classified into business categories. Personal posts often outperform everything else.

6. **Cross-verify before writing.** Run a verification pass: post count, top 5 engagement, category percentages sum to ~100%, CTA count spot-check, avg engagement calculated independently.

7. **Use Playwright with the owner's logged-in session for posts.** Third-party post-scraper actors have been unreliable; a logged-in Playwright session is the dependable method. Profile-level scrapes can use an actor if one is configured.

8. **Never ship below 8/10.** If you're at 7, do more scraping or analysis.

## Quality Standards

- **Minimum 1,000 lines.** Aim for 1,200+.
- **Every claim backed by data.** Specific numbers, not "many" or "often."
- **Engagement figures with exact counts.** "799 avg reactions" not "hundreds of reactions."
- **Honest about limitations.** If the scraper misclassified media, say so. If comments were only scraped from 2 posts, say so. Don't pretend data quality is better than it is.
- **Self-rate 1-10** with specific gaps identified at the end.
- **8/10 is the minimum shipping standard.** 50+ verified posts, all sections present, data cross-checked.

## Output Files

```
content-pipeline/research/creator-bank/data/{slug}_profile.json    - Raw profile data
content-pipeline/research/creator-bank/data/{slug}_posts.json      - Raw post data (50+ posts)
content-pipeline/research/creator-bank/{slug}_linkedin-dna.md      - The DNA profile (1,000+ lines)
```

## After Completion

1. Commit all 3 files with a descriptive message
2. Push to the remote
3. The DNA profile is now available to the `linkedin-content` skill for post production

---

## Related

- [[linkedin-content]]
- [[creator-oracle]]
- [[voice-check]]
