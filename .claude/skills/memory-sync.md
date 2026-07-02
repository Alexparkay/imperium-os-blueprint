---
title: Memory Sync
tags:
  - "system"
type: skill
status: active
created: 2026-04-02
updated: 2026-06-11
description: "Scan the current conversation for new information and persist it to the correct memory files. Use at session end, after brain dumps, after strategy discussions, or when the owner says \"save this\", \"remember this\", \"update memory\"."
name: memory-sync
---

# Memory Sync

Scan the conversation for intel that should be persisted to `memory/` files. This system learns continuously. Nothing should be lost between sessions.

## Memory File Targets

| Category | File | What Goes Here |
|----------|------|---------------|
| Personal | `memory/owner_profile.md` | Location, health, travel, life updates |
| People | `memory/people.md` | New contacts, relationship updates |
| People (deep) | `memory/people/dossiers/` | Individual dossier files for key people |
| Tasks + commitments | `memory/kanban.md` | Promises, deadlines, commitments the owner made |
| Dates | `memory/calendar.md` | Events, deadlines, launches |
| Business strategy | `memory/business/strategy.md` | Company strategy, revenue model, offer changes |
| Personal brand | `memory/business/personal_brand.md` | The owner's brand positioning, content direction |
| Finances | `memory/finances.md` | Revenue, costs, financial changes (provenance required per the financial-accuracy rule) |
| Patterns | `memory/patterns.md` | Behavioral patterns, lessons, mindset shifts |
| Content ideas | `memory/content/ideas_backlog.md` | Video concepts, hooks, titles, newsletter topics |
| Publishing log | `memory/content/publishing_log.md` | Published content, platforms, metrics |
| System changes | `memory/system_changelog.md` | Code/system changes and WHY |

## Extraction Protocol

Scan the conversation for:

1. **People** - Any name mentioned with context (who they are, relationship to the owner, what happened)
2. **Decisions** - Anything the owner decided ("let's do X", "I'm going with Y", "scrap Z")
3. **Goals/Deadlines** - New targets, timelines, commitments
4. **Strategy Changes** - Pivots, new approaches, abandoned plans
5. **Financial Data** - Revenue, costs, investments, deals
6. **Content Ideas** - Topics, hooks, titles, formats the owner wants to try
7. **Behavioral Insights** - Patterns the owner noticed about themselves, lessons learned
8. **Tool/Tech Changes** - New tools adopted, integrations built, systems changed

## Rules

- Write IMMEDIATELY, not at end of session
- Convert relative dates to absolute (e.g., "Thursday" → "2026-03-20")
- Append to existing files, don't overwrite
- Cross-reference: if a person is mentioned, check both `people.md` AND `people/dossiers/`
- If a new category of info appears that doesn't fit existing files, create a new file and update this skill

## Output

After syncing, report:
```
MEMORY SYNC COMPLETE

Updated:
- [file] - [what was added]
- [file] - [what was added]

No changes needed:
- [category] - no new intel detected
```

---

## Related

- [[memory-dream]]
- [[braindump-router]]
- [[project-health]]
