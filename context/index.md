---
title: Context OS, the business spine
type: context
status: template
---

# Context OS: {{COMPANY_NAME}} Business Spine

The canonical, lean entry point a fresh Claude Code session reads to know the business.
This file is a **top sheet of pointers**, not a copy. Detail lives in `memory/business/`.

> Four C's check: a fresh session should answer "what does this business do and who works here?" from this folder alone, without browsing the rest of the repo. If it can't, fix this folder, not the agent.

## Read order

1. [company.md](company.md): who {{COMPANY_NAME}} is, ICP, positioning, what we are and are NOT
2. [offers.md](offers.md): the offers and how they map to clients and products
3. [glossary.md](glossary.md): entities, acronyms, names

## Where detail lives (single source of truth)

- Business strategy + products → `memory/business/`
- Live client engagements → `clients/<name>/STATUS.md`
- People + relationships → `memory/people/`
- Brand voice → `content-pipeline/voice-profile/`
- Finances → `memory/finances.md` (sensitive, never summarised here)
- Active tasks + dates → `memory/kanban.md`, `memory/calendar.md`

## Maintenance

Keep this folder lean. When it drifts from `memory/business/`, fix the pointer, do not duplicate the content. These three files are filled during onboarding Phase 2 and re-checked whenever the business changes shape (new offer, new ICP, pivot).
