---
title: Deep Research
tags:
  - research
type: skill
status: active
created: 2026-06-11
name: deep-research
description: "Deep multi-source research engine: parallel web research + YouTube transcript analysis, synthesized into a cited report. Trigger when the owner says 'deep research', 'research [topic] properly', 'find the best content about', 'what are the top people saying about', 'deep dive into [topic]', or any request for a comprehensive, fact-checked research mission. NOT for quick lookups or single questions."
---

# Deep Research — multi-source missions with citations

Runs a full research mission: discover the best sources across the web and YouTube, extract what they actually say, verify the load-bearing claims, and synthesize one cited report.

## When to use

Comprehensive questions where the answer needs triangulation: market landscapes, "what's working in X right now", competitor sweeps, strategy inputs, tool/approach comparisons. For a single fact, just search. For one video, use youtube-research.

## The pipeline

1. **Scope (30 seconds).** Restate the mission in one sentence + 3-5 sub-questions. If the ask is too vague to research (no use case, no constraint), ask ONE clarifying question, then proceed.
2. **Discover in parallel.** Run multiple web searches from different angles (the topic, its critics, its practitioners, "X vs Y", recent-news angle). For YouTube: find the 5-15 highest-signal videos (recent, from practitioners not news-readers).
3. **Extract.** Web sources: fetch and pull the claims with their evidence. YouTube: ALWAYS use the Apify pipeline, never WebFetch a YouTube page:
   `cd {{REPO_PATH}}/automations/youtube && node bulk-chase.js "<output-dir>" "<url1>" "<url2>" ...`
   Read the saved transcripts and extract frameworks, claims, and numbers per video.
4. **Verify.** Every load-bearing claim needs 2+ independent sources or an explicit `[SINGLE SOURCE]` flag. Anything that could have changed in the last 30 days gets a fresh search. Vendor claims about their own product get a `[VENDOR CLAIM]` flag.
5. **Synthesize.** One report: answer first, then evidence by sub-question, then a "what this means for {{COMPANY_NAME}}" section, then sources. Save to `research/YYYY-MM-DD-<topic>/REPORT.md` with raw transcripts in a `transcripts/` subfolder.
6. **Deliver.** Summary in chat (bullets, conclusions first), file links, and a Telegram notify if the mission ran long.

## Scaling

For big missions, spawn parallel sub-agents (one per sub-question or source type). Sub-agents start blank: inject the working directory, the Apify command above, the scrub/verification rules, and where to save outputs (subagent-context rule).

## Quality bar

- Every claim in the report traces to a named source.
- Disagreements between sources are surfaced, not averaged away.
- The report states what was NOT covered (sources unavailable, claims unverifiable).
- Quality-gate the report before delivery.

---

## Related

- [[youtube-research]]
- [[trend-intelligence]]
- [[creator-oracle]]
- [[02-subagent-context]]
