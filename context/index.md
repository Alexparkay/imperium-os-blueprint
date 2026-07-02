---
title: Context OS, the business spine
type: context
status: template
---

# Context OS: {{COMPANY_NAME}} Business Spine

The canonical, lean entry point a fresh Claude Code session reads to know the business.
This file is a **top sheet of pointers**, not a copy. Detail lives in `memory/business/`.

> Four C's check: a fresh session should answer "what does this business do, who works here, and whose seat is this?" from this folder alone, without browsing the rest of the repo. If it can't, fix this folder, not the agent.

## Read order

**0. Persona** - [identity.md](identity.md): the system's name, register, and standing pushbacks (auto-loads with CLAUDE.md; 150-word cap).

**1. Org truth** - `context/org/`, company-wide facts, identical for every seat (mode explainer: [org/README.md](org/README.md)):

- [org/company.md](org/company.md): who {{COMPANY_NAME}} is, ICP, positioning, what we are and are NOT
- [org/offers.md](org/offers.md): the offers and how they map to clients and products
- [org/departments.md](org/departments.md): who leads each function, who approves what
- [org/people-roster.md](org/people-roster.md): who works here and how to reach them
- [org/glossary.md](org/glossary.md): entities, acronyms, names

**2. Seat truth** - local to this install, never synced:

- [seat.md](seat.md): who sits here, the real daily operator, approval boundary, KPIs

## Where detail lives (single source of truth)

- Business strategy + products → `memory/business/`
- Live client engagements → `clients/<name>/STATUS.md`
- People + relationships → `memory/people/` (the roster is names only; dossiers live here)
- Brand voice → `content-pipeline/voice-profile/`
- Finances → `memory/finances.md` (sensitive, never summarised here)
- Active tasks + dates → `memory/kanban.md`, `memory/calendar.md`

## Maintenance

Keep this folder lean. When it drifts from `memory/business/`, fix the pointer, do not duplicate the content. Single-seat installs fill `context/org/` during onboarding Phase 2 and edit it whenever the business changes shape. In org mode, `context/org/` is a read-only mirror of the company's org context repo: never edit it here, propose changes via `memory/org-proposals/` (rule: `.claude/rules-import/32-org-context.md`). The seat file is always local, always editable.
