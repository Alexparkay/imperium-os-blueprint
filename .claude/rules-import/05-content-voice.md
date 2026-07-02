---
title: "MANDATORY: Content Must Not Smell Like AI"
type: rule
status: active
created: 2026-06-11
---

# MANDATORY: Content Must Not Smell Like AI

All content generated for the owner must:

- Sound like a real person, not a language model
- Use casual, direct language. No dramatic superlatives ("unlock", "revolutionize", "game-changer")
- Full banned-words list: `.claude/skills/voice-check.md` (single source of truth)
- Anti-AI slop patterns: `.claude/rules/11-anti-ai-slop.md`
- Include spontaneity, imperfect phrasing, personality
- Reference `content-pipeline/voice-profile/` for the owner's voice standards (built during onboarding Phase 3)
- Wire in ICP, funnel context, and business goals from `context/` and `memory/business/`
- **Compression test:** If a paragraph can be one sentence, it should be one sentence
- **No forced negation:** Don't write "It's not X, it's Y." Just say Y.
- **No staccato repetition:** Vary sentence length and rhythm. Never 3+ same-cadence sentences in a row.

Quality threshold: avg 9+, no dimension below 7 (see `.claude/rules/10-quality-gate.md`).
