---
name: blueprint-archive
description: "Process new files dropped into memory/blueprints-archive/ folder. Reads every file thoroughly, evaluates against existing codebase knowledge, identifies new/overlapping/contradictory intel, distributes content to correct memory/ locations, creates or updates skills if needed, and provides a full integration report. Trigger on: \"process blueprints\", \"new files in archive\", \"integrate blueprints\", \"blueprint archive\", \"sort blueprints\", \"import documents\", \"new documents to process\", or when files appear in memory/blueprints-archive/."
metadata:
  title: Blueprint Archive - Import, Evaluate, Distribute, Learn
  tags:
    - "system"
  type: skill
  status: active
  created: 2026-04-02
  updated: 2026-06-11
---

# Blueprint Archive - Import, Evaluate, Distribute, Learn

## Purpose
Automate the integration of unstructured documents dropped into `memory/blueprints-archive/` into the
structured codebase. Every file gets read, evaluated, distributed, and learned from - then the
archive can be cleared.

## Trigger
- User says to process blueprints
- Proactively when you notice new files in `memory/blueprints-archive/`
- At session start: quick check `ls memory/blueprints-archive/ 2>/dev/null` - if files exist, notify the owner

## Execution Protocol

### Phase 1: SCAN - Inventory the Archive
```bash
ls -la memory/blueprints-archive/
```
Count files, note sizes, identify file types.
- **PDFs:** Use the Read tool with `pages` parameter (max 20 pages per read)
- **Large files (>2000 lines):** Use `wc -l` to check, then read in chunks or delegate to a sub-agent
- **Non-text files:** Flag for the owner - can't process images, videos, etc.

### Phase 2: READ - Deep Analysis (Parallelise When Possible)
**For 4+ files:** Use parallel agents. Each agent reads 2-3 files and returns structured analysis.
**For 1-3 files:** Read directly in main context.

Inject into every sub-agent prompt:
- "Working directory: {{REPO_PATH}}"
- "Use `cd {{REPO_PATH}}/automations/youtube && node transcripts.js '<url>'` for YouTube. Do NOT use WebFetch for YouTube URLs."
- "Do NOT create or modify files. Return analysis only."

For each file, extract:
- **Topic:** What is this about?
- **Author/Source:** Who created it? (the owner, a team member, external?)
- **Type:** Strategy | Skill | Action plan | Outreach template | Presentation | Research | Intel | SOP | Financial
- **Key concepts:** Named frameworks, specific numbers, dates, people, decisions
- **Actionable items:** To-do lists, deadlines, build instructions
- **Time-sensitive:** Any dates, deadlines, or events that need flagging
- **Company relevance:** How does this connect to {{COMPANY_NAME}} and the owner's business?

### Phase 3: EVALUATE - Compare Against Existing Knowledge
For each file, **grep existing memory/ files** for key terms before declaring something "new":
```bash
grep -rl "<named framework from the file>" memory/ 2>/dev/null
grep -rl "revenue share" memory/business/ 2>/dev/null
```

Score along 4 dimensions:
1. **NEW (%):** Concepts, frameworks, strategies, people, numbers not in any existing file
2. **OVERLAPPING (%):** Content that exists but adds nuance or detail
3. **CONTRADICTORY (%):** Information that conflicts with existing files
4. **BETTER (%):** Cases where the blueprint version is more detailed/accurate

**Novelty score 1-10** (be harsh):
- 1-3: Mostly redundant, minor additions at best
- 4-6: Meaningful new angles or enriches existing topics
- 7-9: Substantial new knowledge not covered anywhere
- 10: Entirely new domain/concept

### Phase 4: PLAN - Determine Distribution Targets

| Content Type | Target Location |
|---|---|
| Business strategy (offers, pricing, revenue) | `memory/business/` |
| Event plans, logistics, speaker notes | `memory/business/events/` |
| Outreach templates, pitch scripts, sequences | `memory/business/outreach/` |
| Presentation decks, slide content | `memory/business/presentations/` |
| Creator intel, transcripts, DNA profiles | `memory/content/creator-blueprints/` |
| Content strategy, calendars, pillars | `memory/content/` |
| People intel, new contacts | `memory/people.md` or `memory/people/dossiers/` |
| Financial data, revenue models, costs | `memory/finances.md` |
| Personal details, life updates | `memory/owner_profile.md` |
| Behavioral patterns, lessons | `memory/patterns.md` |
| Action plans, deadlines, commitments | `memory/kanban.md` + `memory/calendar.md` |
| Voice/content style guidelines | `content-pipeline/voice-profile/` |

**Distribution rules:**
- NEVER delete the archive file until distribution is confirmed
- If a file maps to an existing memory file, UPDATE that file (don't create duplicate)
- If a file is entirely new domain, CREATE new file in appropriate location
- Preserve ALL information - never discard during distribution
- **Before updating any file, READ it first** to avoid duplicating existing content
- **Before creating a new file, grep** to confirm the content doesn't already live somewhere

### Phase 5: DISTRIBUTE - Move Content to Correct Locations
For each file:
1. `mkdir -p` target directory if needed
2. Copy or write content to target location
3. If updating existing file: use Edit to ADD new sections (don't overwrite)
4. If creating new file: use Write with clear headers and structure
5. Verify each file was written: `ls -la <target>`

**Parallelise:** If distributing to 4+ unrelated targets, use parallel agents for the writes.

### Phase 6: CROSS-REFERENCE - Update Connected Files
After distribution, check ALL of these:
1. `memory/people.md` - new people mentioned?
2. `memory/kanban.md` + `memory/calendar.md` - new deadlines/commitments?
3. `memory/finances.md` - new revenue data/projections?
4. `memory/system_changelog.md` - append integration entry
5. Existing skills in `.claude/skills/` - do any need source file updates?
6. The skill-routing rule - does the skill table need new entries?
7. The auto-memory MEMORY.md index - needs updating if new file paths created

### Phase 7: REPORT - Integration Summary
Present to the owner:

```
## Blueprint Archive Integration Report

### Files Processed: [count]

| File | Size | Novelty | Target | Action |
|---|---|---|---|---|
| filename.md | 14K | 8/10 | memory/business/... | Created new |
| filename2.md | 26K | 4/10 | memory/business/strategy.md | Updated existing |

### Key New Intel:
- [genuinely new concepts, frameworks, numbers]

### Contradictions Found:
- [conflicts - the owner decides which version is correct]

### Files Updated: [list with paths]
### New Files Created: [list with paths]
### Skills Affected: [any that were updated or should be created]

### Action Items Extracted:
- [deadlines, to-dos, time-sensitive items]

### Ready to Delete Archive?
✅ All [X] files fully distributed. Safe to delete contents of memory/blueprints-archive/.
⚠️ [X] files need attention: [specific reasons]
```

### Phase 8: COMMIT - Push to GitHub
```bash
cd {{REPO_PATH}} && git add -A && git commit -m "feat: integrate blueprint archive - [count] files, [summary]" && git push origin main
```

## Quality Standards
- NEVER summarise when you can preserve the original detail
- NEVER create a new file when updating an existing one would be better
- ALWAYS read the target file before updating it (to avoid duplication)
- ALWAYS grep before declaring something "new"
- Score novelty HARSHLY - 7+ means genuinely new, not "said differently"
- Flag anything time-sensitive (events, deadlines) PROMINENTLY
- For files >5000 lines, delegate to a sub-agent to avoid context bloat
- Total execution should use parallel agents wherever possible for speed

---

## Related

- [[memory-sync]]
- [[memory-dream]]
- [[competitive-ideation]]
- [[content-cascade]]
