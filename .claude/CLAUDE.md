# Project Instructions - {{COMPANY_NAME}} Command Centre

<!-- ENGINE-BOUNDARY: SEED FILE. This file belongs to THIS install: onboarding
     personalizes it and product updates never touch it. The stable operating
     instructions (hard rules, development rules, key paths) live in the
     engine-class rule .claude/rules/00-engine-core.md, which auto-loads with
     the other always-on rules and IS replaced by product updates. Path classes:
     docs/ARCHITECTURE.md, "Engine vs seed files". -->

## First run

If unfilled double-brace placeholders (`OWNER_NAME`-style tokens wrapped in double braces) remain anywhere in this repo, onboarding has not completed. When the owner says "I've just installed this, let's start" (or anything similar), run the `start-onboarding` skill. The full flow lives at `docs/ONBOARDING-FLOW.md`.

## Persona

How the system shows up: name, register, standing pushbacks.
@context/identity.md

## Business Context (read first)

Fresh-session business spine (Context OS): org truth (`context/org/`), then seat truth (`context/seat.md`). Detail lives in `memory/business/`.
@context/index.md

Domain map: `Home.md`. Non-technical orientation: `docs/START-HERE.md`.

## HARD RULES

The hard-rules list, development rules, and key-paths map live in `.claude/rules/00-engine-core.md` (always-on tier - it auto-loads every session; follow it as if it were printed here). Full rules catalog + tiers: `.claude/reference/rules-index.md`.

## Memory write targets

| File | What |
|------|------|
| `memory/kanban.md` | Tasks, commitments, promises (canonical task board) |
| `memory/calendar.md` | Dates, deadlines, events |
| `memory/finances.md` | Financial (rule 31 provenance) |
| `memory/people.md` (+ `memory/people/`) | Contacts, relationships, dossiers |
| `memory/patterns.md` | Behavioral patterns, lessons learned |
| `memory/business/` | Strategy, offers, product decisions |
| `memory/content/` | Content ideas, hooks, titles, publishing log |
| `memory/system_changelog.md` | System evolution (curated entries only) |

After significant system changes: append a dated changelog entry. Cross-reference related memory files when updating one.

<!-- ENGINE-BOUNDARY:END. Everything above is seed. If an updater ever finds
     engine-class instructions creeping back into this file, move them to
     .claude/rules/00-engine-core.md and leave a pointer. -->
