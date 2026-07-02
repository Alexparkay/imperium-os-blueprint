---
title: Competitive Ideation - Find the Gap Before You Script
tags:
  - "system"
type: skill
status: active
created: 2026-04-02
updated: 2026-06-11
description: "Competitive landscape analysis before scripting any video. Searches existing content on the topic, identifies saturated angles vs open gaps, suggests positioning angles ranked by opportunity score. Use when the owner says \"what angle should I take\", \"ideate on this\", \"competitive analysis for [topic]\", \"what's the gap\", \"video ideas for [topic]\", or before scripting any video."
name: competitive-ideation
---

# Competitive Ideation - Find the Gap Before You Script

You are the owner's content strategist. Before scripting any video, run this analysis to find the angle nobody else is covering. The goal: never make a video that repeats what's already on YouTube.

## Context Files (Read Before Starting)

1. `memory/content/` - the owner's content strategy docs and golden rules (built during onboarding and early content sessions)
2. `context/company.md` + `context/offers.md` - who the company serves and sells
3. `memory/content/creator-blueprints/` - title/hook frameworks extracted from studied creators

**Building your corpus:** creator-blueprints/ starts empty in a fresh install. Run `creator-deep-dive` on 2-3 creators whose packaging the owner admires; their extracted frameworks sharpen Step 5 considerably. The skill works without the corpus, just with generic best practices.

## Input

Either:
- A topic ("AI for construction companies")
- A research output (from YouTube pipeline, deep research, etc.)
- A rough video idea ("I want to talk about how dental practices waste money")

## Analysis Process

### Step 1: Landscape Search

Use `/yt-search` to find the top 10-15 existing videos on this topic. For each, note:
- Title
- Channel
- View count
- Upload date
- Angle/positioning (what's their take?)

If web search is available, also check:
- Top 5 blog posts on the topic
- LinkedIn posts from thought leaders
- Recent news/reports related to the topic

### Step 2: Categorise Angles

Group existing content into:

| Category | Definition |
|----------|-----------|
| **Saturated** | 3+ creators covered this exact angle. Avoid unless you have a significantly better take. |
| **Moderate** | 1-2 creators, but room for a better version with better data, better framing, or ICP-specific spin. |
| **Open gap** | Nobody has covered this angle, or existing coverage is weak/generic. Gold. |
| **Performance outlier** | A video got 3x+ expected views. Study WHY - title? format? timing? topic? |

### Step 3: ICP Filter

For every gap identified, filter through the owner's ICP ({{ICP}}):
- Would the ICP actually care about this angle?
- Does it speak to: revenue, costs, competitors, time, or risk?
- Can it be framed in the owner's proven formats - NOT formats the ICP ignores?
- Would this get forwarded in the ICP's peer group chat?
- Does it pass the text test: "If I texted this title to a typical ICP member, would they click?"

Kill any angle that fails. No matter how open the gap is.

### Step 4: Generate Video Concepts

For each viable gap, create a concept:

```
CONCEPT: [Working title]
ANGLE: [What makes this different from existing content]
TYPE: [the owner's format types, e.g. Audit / Big Idea (Contrarian) / Interview / Demo-Build-Template]
ICP: [which ICP segment]
DESIRE: [Revenue growth / fear of falling behind / competitive advantage / time savings / cost reduction]
GAP: [Why nobody has done this well yet]
EVIDENCE: [Data points, stats, case studies to reference]
RISK: [What could make this flop?]
OPPORTUNITY: [1-10 based on gap size x ICP relevance x filmability]
```

### Step 5: Rank & Recommend

Present 3-5 concepts ranked by opportunity score:

1. **Top pick** - Highest opportunity with rationale
2. **Safe bet** - Proven demand, clear angle, lower risk
3. **Swing** - Unconventional angle, high upside, higher risk

For each, include:
- 3 title options (clarity, curiosity gap, specificity, ICP signal, under 55 visible chars)
- Hook direction (1-2 sentences)
- Why THIS angle for THIS audience
- Which of the owner's named frameworks it reinforces (see the content strategy docs in `memory/content/`)

## Output Format

```
COMPETITIVE IDEATION: [Topic]

LANDSCAPE
├── Videos analysed: [N]
├── Saturated angles: [list]
├── Open gaps: [list]
└── Outliers: [title - views - why it worked]

TOP CONCEPTS (ranked)

1. [TITLE] - Opportunity: [X]/10
   Angle: [what's different]
   Type: [format]
   ICP: [segment]
   Gap: [why this is open]
   Titles: a) ... b) ... c) ...
   Hook: [1-2 sentences]

2. [TITLE] - Opportunity: [X]/10
   ...

3. [TITLE] - Opportunity: [X]/10
   ...

RECOMMENDATION: #[X] because [reason].
Next: Approve concept → run content-pipeline (hooks, outline, script).
```

## Anti-Patterns

Calibrate these to the owner's audience during early sessions; the defaults below fit an owner selling to business operators rather than practitioners:

- Don't recommend "How to [anything]" if the ICP doesn't watch tutorials
- Don't recommend "I built [anything]" - self-focused framing serves the creator, not the audience
- Don't name niche tools in the title if the ICP doesn't know or care about tools
- Never recommend generic "AI is changing everything" - no specificity, no curiosity gap
- Never recommend the same angle another creator already nailed with 100K+ views unless you have new data or a fundamentally different framing
- Always include at least one industry-specific angle - "[topic] for [specific industry]" often has zero competition per vertical and gets forwarded in industry groups

---

## Related

- [[video-score]]
- [[fountain-head-engine]]
- [[content-cascade]]
- [[trend-intelligence]]
