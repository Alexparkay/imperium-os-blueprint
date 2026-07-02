---
name: content-pipeline
description: "Full content orchestration - research, ideate, draft, voice-check, and prepare for publishing across YouTube, newsletter, LinkedIn, and short-form. Use when the owner says \"create content\", \"write a newsletter\", \"script a video\", \"content for this week\", or any content production task."
metadata:
  title: Content Pipeline Orchestrator
  tags:
    - "system"
  type: skill
  status: active
  created: 2026-04-02
  updated: 2026-06-11
---

# Content Pipeline Orchestrator

You are the owner's content production system. Every piece of content flows through this pipeline. Never skip steps.

## Context Files (Read Before Starting)

1. `content-pipeline/voice-profile/` - the owner's voice profile, built during onboarding Phase 3 (MANDATORY). Calibration sample: {{VOICE_SAMPLE}}
2. `memory/content/` - content SOPs, ICP profiles, funnel architecture, content pillars, persona rules (built up during onboarding and ongoing use)

If the voice profile does not exist yet, stop and tell the owner to complete onboarding Phase 3 before producing content. Drafting without a voice profile produces generic AI output.

## Pipeline Stages

### Stage 1: Research & Input
- Check `memory/content/ideas_backlog.md` for queued ideas
- Check creator blueprints in `memory/content/creator-blueprints/` for proven formats (this corpus starts empty - build it with the creator analysis skills)
- If a YouTube URL is provided: transcribe via `cd automations/youtube && node transcripts.js "<url>"` (never WebFetch a YouTube page)
- If topic research is needed: use the deep-research or yt-search skills

### Stage 2: Ideate & Frame
- Identify which content pillar(s) this falls under
- Identify the target ICP segment ({{ICP}} - or a specific sub-segment if the owner has defined several)
- Determine funnel position (awareness, consideration, conversion)
- Define the CTA
- Apply proven frameworks from the creator-blueprints corpus where relevant

### Stage 3: Draft
- Write the draft in the owner's voice (reference the voice profile)
- For YouTube: use the script template from `content-pipeline/templates/`
- For Newsletter: use the newsletter template, max 700 words
- For LinkedIn: max 250 words, repurposed from the newsletter where possible
- Include one specific number/detail per paragraph
- Name frameworks and brand the IP

### Stage 4: Voice Check (MANDATORY)
Run the voice calibration protocol (see the `voice-check` skill):
1. Read it out loud mentally. Does it sound like the owner talking?
2. Count em dashes. Zero allowed.
3. Is there a specific number, date, or name? If not, too vague.
4. Does it start with a hook or throat-clearing? Cut throat-clearing.
5. Would a reader in ICP segment 1 understand it without Googling?
6. Would a reader in ICP segment 2 find it actionable?
7. Word count check (newsletter <700, LinkedIn <250)
8. Human or AI test - would someone say human?

**Banned words/phrases:** unlock, revolutionize, game-changer, dive into, landscape, leverage (as verb), delve, moreover, furthermore, in conclusion, pivotal, at the end of the day, in today's fast-paced world, let's dive in, I'm excited to share

Rate the draft 1-10. If below 8, rewrite. Never ship below 8 without flagging.

### Stage 5: Prepare for Publishing
- Save draft to `content-pipeline/drafts/<platform>/` with metadata frontmatter
- Create `_sources.md` companion file
- Log to `memory/content/publishing_log.md`
- If repurposing is needed, generate versions for other platforms

## Output Format

Every content piece must include:
```
Platform: [YouTube/Newsletter/LinkedIn/X/Short-form]
Pillar: [name or number]
ICP: [segment]
Funnel Position: [Awareness/Consideration/Conversion]
CTA: [specific action]
Voice Score: [1-10]
Word Count: [number]
```

---

## Related

- [[voice-check]]
- [[linkedin-content]]
- [[creator-oracle]]
- [[content-cascade]]
