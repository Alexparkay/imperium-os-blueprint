---
name: youtube-research
description: "Full YouTube video research workflow - transcribe via Apify, extract key insights, save findings to memory, and optionally create content briefs. Use when the owner shares a YouTube URL, says \"research this video\", \"what does this say\", or wants to study a creator's content."
metadata:
  title: YouTube Research Workflow
  tags:
    - "system"
  type: skill
  status: active
  created: 2026-04-02
  updated: 2026-06-11
---

# YouTube Research Workflow

Research YouTube videos and extract actionable intelligence for the owner's content machine and business strategy.

## CRITICAL: Transcription Method

**ALWAYS use Apify. NEVER use WebFetch for YouTube.**

```bash
cd automations/youtube && node transcripts.js "<youtube-url>"
```

## Workflow

### Step 1: Transcribe
Run the Apify command above. Wait for full transcript output.

### Step 2: Extract Intelligence
From the transcript, extract:

**Content Intel:**
- Main thesis/argument (1-2 sentences)
- Key frameworks or models mentioned (name them)
- Specific numbers, stats, or data points
- Hooks used (opening lines, pattern interrupts)
- CTAs and monetization methods
- Content structure (how the video is organized)

**Business Intel:**
- Strategies or tactics relevant to {{COMPANY_NAME}}
- Tools or platforms mentioned
- Market insights or trends
- Competitor intelligence

**Content Ideas:**
- What could the owner create inspired by this? (not copy, but the owner's unique angle)
- Which content pillar does this map to?
- Which ICP segment would this serve?

### Step 3: Save to Memory
- New people mentioned → `memory/people.md`
- Content ideas generated → `memory/content/ideas_backlog.md`
- Business strategies → `memory/business/strategy.md` or `memory/business/personal_brand.md`
- If it's a creator deep dive → check if a blueprint exists in `memory/content/creator-blueprints/`

### Step 4: Brief (Optional)
If the owner wants to create content based on this video:
- Generate a content brief using the content-pipeline skill
- Apply title/hook frameworks from the creator-blueprints corpus (if built)
- Cross-reference with the owner's content pillars

## Output Format

```
VIDEO: [title]
CREATOR: [name]
LENGTH: [duration]

THESIS: [1-2 sentences]

KEY TAKEAWAYS:
1. [takeaway with specific detail]
2. [takeaway with specific detail]
3. [takeaway with specific detail]

FRAMEWORKS: [named frameworks from the video]

THE OWNER'S ANGLE: [how the owner could use this, which pillar, which ICP segment]

SAVED TO: [list of memory files updated]
```

## Multi-Video Research
If given multiple URLs, process each sequentially (Apify one at a time), or use `node bulk-chase.js <outDir> <urls...>` in `automations/youtube/` for batches. Synthesize findings across all videos at the end.

## Creator Channel Research
For full channel analysis, use the `/creator-deep-dive` skill instead. This skill is for individual video research.

---

## Related

- [[youtube-algorithm]]
- [[youtube-packaging]]
- [[competitive-ideation]]
- [[content-cascade]]
