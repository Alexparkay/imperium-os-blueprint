---
title: Naming Conventions
type: reference
status: active
---

# Naming Conventions: repo-wide standard

One standard, everywhere, enforced forward-only. New files follow it; nothing gets mass-renamed.

## The standard

1. **kebab-case** for all new files and folders. No snake_case, no spaces, no TitleCase.
2. **Dated artifacts are date-FIRST ISO:** `YYYY-MM-DD-topic-slug` (files or folders). Sortable, globbable. Never date-last, never underscores in the date.
3. **Folders that hold one concept get the concept's name,** singular where natural.
4. **Underscore prefix = system/meta:** `_archive/`, `_TEMPLATE/`, `_prospects/`, `_build/`. Underscore-prefixed dirs are excluded from registries and lint counts.
5. **Legacy exceptions:** the core memory stubs shipped with this template (`system_changelog.md`) keep their names because rules and skills reference them. Everything you create new is kebab-case.

## Where things live

- **Tasks / commitments / promises:** `memory/kanban.md` (task level) + `memory/calendar.md` (date level)
- **Reference files (top-level memory/):** `people.md`, `patterns.md`, `finances.md`, `goals.md`
- **Business strategy + products:** `memory/business/` and `memory/business/products/<product>/`
- **People depth:** `memory/people/dossiers/<name>.md`, frameworks in `memory/people/frameworks/`
- **Content knowledge:** `memory/content/`, creator studies in `memory/content/creator-blueprints/<creator>/`
- **Voice transcripts:** `memory/transcripts/YYYY-MM-DD.md`, one file per day
- **Research outputs:** `content-pipeline/research/YYYY-MM-DD-topic/` (folder per mission, `00-`-prefixed master doc first)
- **Client work:** `clients/<name>/` (see `clients/README.md`), never inside memory/

## Inside files

- Top-level `#` title; dated sections as `## YYYY-MM-DD`
- Cross-reference with wiki-links: `[[file-name]]` (filename-based, survives moves within the vault)
- Curated changelog entries go newest-first in `memory/system_changelog.md`
- New info from the owner gets persisted to the correct file IMMEDIATELY, not at end of session

---

## Related

- [[system_changelog]]
- [[kanban]]
- [[calendar]]
