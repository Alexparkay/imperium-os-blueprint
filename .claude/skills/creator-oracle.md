---
title: Creator Oracle - Creator Intelligence System
tags:
  - "system"
type: skill
status: active
created: 2026-04-02
updated: 2026-06-11
description: "Surface the right creator frameworks for any business situation. Queries the creator intelligence corpus (built by the owner from YouTube transcripts and creator deep dives) to find who to channel for offers, content, sales, positioning, objection handling, or strategy. Trigger on \"who should I channel\", \"what would [creator] say\", \"creator for this\", \"framework for\", offer design, sales prep, content planning, or any strategic decision where proven operator wisdom applies."
name: creator-oracle
---

# Creator Oracle - Creator Intelligence System

## How This Skill Works

This skill queries a **creator intelligence corpus**: extracted frameworks, voice profiles, and playbooks from business creators whose content the owner studies. When a business situation comes up, the oracle surfaces which creator to channel and which of their frameworks applies.

## Corpus Location (Read When Activated)

- **Creator blueprints:** `memory/content/creator-blueprints/` - one folder or file per creator
- **Full extractions:** `memory/content/creator-blueprints/extractions/` - multi-creator extraction files (12 sections per creator)
- **Voice profiles:** quick-reference lookup files alongside the extractions

**The corpus starts EMPTY in a fresh install.** Build it:

1. Run the `creator-deep-dive` workflow (or equivalent YouTube analysis skill) on each creator the owner wants in the corpus - it pulls transcripts via the YouTube/Apify pipeline and extracts frameworks, hooks, and voice
2. Save each creator's extraction to `memory/content/creator-blueprints/<creator-slug>/`
3. After 3+ creators exist, build the Quick Situation Lookup table below for the owner's actual corpus
4. Re-run this maintenance whenever a new creator is added

Until the corpus has at least one creator, tell the owner the oracle has no profiles yet and offer to run a deep dive on a creator they name.

## Quick Situation Lookup (template - populate from the owner's corpus)

Maintain a table in this skill file mapping recurring situations to creators and frameworks. Example structure from a mature install:

| Situation | Channel These Creators | Key Frameworks |
|-----------|----------------------|----------------|
| **Designing an offer** | [creators with offer-design depth] | [their named offer frameworks] |
| **YouTube script/title** | [creators with packaging depth] | [hook/title frameworks] |
| **Sales call prep** | [creators with sales-system depth] | [call structures, setter/closer systems] |
| **Handling objections** | [creators with persuasion depth] | [objection-handling frameworks] |
| **Pricing a deal** | [creators with pricing depth] | [pricing models] |
| **Content calendar** | [creators with content-ops depth] | [cadence/funnel frameworks] |
| **Building delivery SOPs** | [creators with operations depth] | [systemisation frameworks] |
| **Cold outreach** | [creators with outbound depth] | [permission-based, value-first approaches] |
| **Personal brand from zero** | [creators with positioning depth] | [authentic-positioning frameworks] |

Every row must point at profiles that actually exist in the corpus. Never fabricate a creator's position.

## Creator Archetypes (tag each creator as you add them)

Tag every corpus creator with one or more archetypes so selection is fast:

- **Positioning Masters** → clarity, specificity, belief systems
- **Systems & Scale** → systematisation, automation
- **AI Leverage Pioneers** → AI as multiplier
- **Traditional Business Translators** → pain language for established business owners
- **Proof-First Operators** → demonstrating results over credentials
- **Contrarian Thinkers** → challenge conventional wisdom

## How to Use

1. Identify the situation from the lookup table
2. Read the voice profiles for the recommended creators
3. For the full 12-section profile, search the creator's name in the extraction files
4. Always adapt the framework through the owner's voice profile (`content-pipeline/voice-profile/`) - channel the thinking, not the phrasing

## Relationship to Other Oracles

- Use `creator-oracle` for quick single-framework lookups ("what framework fits this situation?")
- Use `mastermind-oracle` for multi-voice debates and roundtables
- Use `founders-oracle` for macro strategy from historical founders

---

## Related

- [[mastermind-oracle]]
- [[founders-oracle]]
- [[content-pipeline]]
- [[blueprint-archive]]
