---
name: memory-dream
description: "Memory consolidation process modeled on Anthropic's Auto Dream feature. Runs a 4-phase cleanup cycle across all memory/ files: orient, gather signal, consolidate, prune. Fixes stale dates, removes contradictions, merges duplicates, archives completed items, trims the auto-memory index. Trigger on '/dream', 'consolidate memory', 'clean up memory', 'memory health', 'prune memory', or run manually after major refactors, strategy pivots, or when memory feels cluttered. Also consider running weekly or after 5+ sessions."
metadata:
  title: Memory Dream - Consolidation & Cleanup
  tags:
    - "system"
  type: skill
  status: active
  created: 2026-04-03
  updated: 2026-06-11
---

# Memory Dream - Consolidation & Cleanup

You are performing a dream - a reflective pass over the memory files. Your job is to consolidate, clean, and organize `memory/` so that the next session starts with accurate, non-contradictory, well-dated context.

## When to Trigger

- `/dream` command
- After 5+ sessions without consolidation
- After major strategy pivots or refactors
- When memory feels cluttered or contradictory
- Weekly maintenance (suggested: Sunday evening)
- When the auto-memory MEMORY.md exceeds 170 lines

## Phase 1: Orient

Scan the memory landscape. Run these commands:

```bash
# Count files and total size
find memory/ -name "*.md" | wc -l
du -sh memory/

# Check the auto-memory index line count (Claude Code keeps it per-project under ~/.claude/projects/<project-slug>/memory/MEMORY.md)
wc -l ~/.claude/projects/<project-slug>/memory/MEMORY.md

# Find files not modified in 30+ days (exclude reference corpora)
find memory/ -name "*.md" -mtime +30 -not -path "*/creator-blueprints/*" | head -30

# Find the 20 most recently modified files
find memory/ -name "*.md" -printf '%T@ %Tc %p\n' 2>/dev/null | sort -rn | head -20
```

Build a mental map of:
- Total file count and size
- Which files are active vs stale
- Which areas have been updated recently
- Whether the auto-memory MEMORY.md is approaching the 200-line limit

## Phase 2: Gather Signal

Search for specific consolidation targets. Do NOT exhaustively read every file. Use targeted greps:

```bash
# Find relative date references that need converting
grep -rn "yesterday\|last week\|last month\|next week\|in a few days\|~.*weeks\|tomorrow\|this morning\|tonight" memory/ --include="*.md" | grep -v "creator-blueprints\|transcripts"

# Find potential contradictions (old vs new strategy, deprecated tools)
grep -rn "TODO\|DEPRECATED\|OLD:\|REMOVE\|no longer\|switched from\|replaced by\|moved to" memory/ --include="*.md" | grep -v "creator-blueprints\|transcripts"

# Find duplicate topic coverage (swap in the owner's main strategy topic)
grep -rln "strategy" memory/ --include="*.md" | sort

# Check kanban for stale items
grep -c "\- \[x\]" memory/kanban.md 2>/dev/null
grep -c "\- \[ \]" memory/kanban.md 2>/dev/null
```

Categorize findings into:
- **Stale dates** - relative dates that need absolute conversion
- **Contradictions** - old info that conflicts with newer info
- **Duplicates** - same fact stored in multiple places
- **Dead references** - links to files/tools that no longer exist
- **Completed items** - done tasks still in active lists

## Phase 3: Consolidate

Apply fixes to the actual memory files. Work through each category:

### 3a. Convert Relative Dates
Every relative date reference becomes absolute:
- "yesterday" → "2026-04-02" (calculate from today's date)
- "~2-3 weeks" → "target: 2026-04-17" (calculate from context)
- "last month" → "March 2026"
- "next week" → "week of 2026-04-07"

### 3b. Resolve Contradictions
When two entries conflict:
- Keep the NEWER one (check git blame or file modification dates if unsure)
- Delete or update the older entry
- If genuinely ambiguous, flag for the owner to decide

### 3c. Merge Duplicates
When the same fact appears in multiple files:
- Keep the entry in the MOST SPECIFIC file (e.g., pricing in `memory/business/strategy.md`, not also in `memory/kanban.md`)
- Add a cross-reference in the other file: `(see [[strategy]] for details)`

### 3d. Remove Dead References
- Check if linked files/paths still exist
- Remove references to deleted tools, old dashboard paths, deprecated automations
- Update path references that have moved

### 3e. Archive Completed Items
For kanban.md:
- Items marked `[x]` older than 14 days → move to `memory/kanban-archive.md`
- Keep only the last 10 completed items in the main kanban
- Ensure archive has date and outcome for each item

For calendar.md:
- Past events older than 14 days → move to "Completed Events" section
- Keep upcoming events clean and current

## Phase 4: Prune & Index

### 4a. Trim Auto-Memory MEMORY.md
Check line count of the project's auto-memory index (`~/.claude/projects/<project-slug>/memory/MEMORY.md`):
- If over 170 lines: identify sections that can be extracted to standalone files
- Large lists (skills, blueprints, corpora) should be ONE-LINE pointers, not full listings
- Each line in MEMORY.md should justify its presence at startup

### 4b. Verify the Index
- Every file listed in the memory index (`memory/_INDEX.md` if present) should exist
- Every important `memory/` file should be listed
- Remove entries for deleted files
- Add entries for new files not yet indexed

### 4c. Check Cross-References
- Wikilinks ([[file]]) should resolve to actual files
- Relative paths should be valid
- MOC files should be current

## Phase 4d: Dictation Corrections Dictionary Maintenance

Maintain `.claude/skills/wispr-corrections/SKILL.md` - the dictation correction dictionary used by braindump-router.

### Tasks

1. **Review Section 9 (self-learning log)** - new patterns the router caught during the week
2. **Promote high-use patterns** - if a pattern appeared 3+ times in `.context/braindump/` logs, move it from Section 9 to the relevant Section 1-6
3. **Prune stale entries** - remove patterns not triggered in 30+ days (check `.context/braindump/` logs for usage)
4. **Deduplicate** - if two entries map the same dictation output to the same correct form, keep one
5. **Flag ambiguous entries** - if a correction caused wrong routing (check audit logs for LOW-tier escalations), add a `<!-- DREAM: verify with owner -->` comment

### Commands

```bash
# Count braindump audit logs from the past week
find .context/braindump/ -name "*.md" -mtime -7 | wc -l

# Extract all "corrections_applied" entries from recent logs
grep -rh "corrections_applied" .context/braindump/ 2>/dev/null | sort | uniq -c | sort -rn | head -20

# Check Section 9 size in wispr-corrections/SKILL.md
grep -c "^- 20" .claude/skills/wispr-corrections/SKILL.md
```

## Phase 5: Raw Sweep & Index Regen

This phase handles the `memory/raw/` capture inbox (if the owner uses one) and per-cluster `master_index.md` files for any large memory cluster.

### 5a. Sweep memory/raw/

```bash
# List items in raw/ with their age in days
find memory/raw/ -name "*.md" -not -name "README.md" -printf '%T@ %p\n' | sort -n
```

For each item:
- **Age < 7 days** - leave alone, not due yet
- **Age 7-14 days** - flag for promotion or deletion, ask the owner which
- **Age > 14 days** - promote or delete now, do not let it rot

Promotion options:
1. **Move into a cluster** - rename and move to the right folder (creator-blueprints, people/dossiers, business/, content/ideas_backlog, etc.)
2. **Merge into existing file** - distil key points into a relevant existing memory file, then delete the raw source
3. **Wikilink-only** - if the raw source has lasting reference value, leave it in raw/ but add a wikilink from the promoted memory file back to it (rare, only for important source material)
4. **Delete** - if it turned out not to be useful, delete without guilt

Never leave undated items. Never leave items older than 14 days untouched.

### 5b. Regenerate master_index.md files

Update the index of any memory cluster that has one. Common candidates as the system grows:
- `memory/content/creator-blueprints/master_index.md`
- `memory/people/dossiers/master_index.md`
- `memory/business/master_index.md`

For each index:
1. List all top-level files/folders in the cluster
2. For each entry, generate or update the one-line hook (pull from the file's frontmatter `description` or first paragraph)
3. Preserve the existing structure (sections, usage notes, cross-references)
4. Only update the entry list, not the surrounding context

### 5c. Flag missing indices

If a new high-traffic cluster has emerged without a master_index.md, flag it for the owner to create. Candidates:
- `memory/business/` subfolders if they grow beyond 10 files
- `memory/content/` subfolders with active use
- Any folder Claude queries frequently

## Output Report

After consolidation, output a dream report:

```
DREAM COMPLETE - [date]

Phase 1 (Orient):
- Total files: X | Size: XMB
- MEMORY.md: X/200 lines
- Files not modified in 30+ days: X

Phase 2 (Signal):
- Stale dates found: X
- Contradictions found: X
- Duplicates found: X
- Dead references found: X
- Completed items to archive: X

Phase 3 (Consolidate):
- Dates converted: X
- Contradictions resolved: X
- Duplicates merged: X
- Dead references removed: X
- Items archived: X

Phase 4 (Prune):
- MEMORY.md: X/200 lines (was X)
- Index entries added: X, removed: X
- Cross-references fixed: X

Phase 5 (Raw Sweep & Indices):
- raw/ items swept: X (promoted: X, merged: X, deleted: X)
- master_index.md files updated: X
- Missing indices flagged: X

Next dream recommended: [date, based on activity level]
```

## Safety Rules

- NEVER delete reference corpora (creator-blueprints/ or similar imported research - reference material, not session memory)
- NEVER delete transcripts/ or braindumps/ (raw source data)
- NEVER modify files you're unsure about - flag them for the owner
- Always make changes via Edit tool, not bulk overwrites
- If a contradiction is ambiguous, add a `<!-- DREAM: ambiguous, needs owner input -->` comment

## Exclusions (Do Not Touch)

These directories are reference material, not session memory. Skip them during consolidation (BUT do regenerate their `master_index.md` files in Phase 5, that's the one exception):
- `memory/content/creator-blueprints/` (content exempt, index regenerated)
- `memory/transcripts/`
- `memory/braindumps/`
- `memory/people/frameworks/` (if present)
- `memory/people/dossiers/` (content exempt, index regenerated)

---

## Related

- [[memory-sync]]
- [[project-health]]
- [[quality-gate]]
- [[wispr-corrections]]
