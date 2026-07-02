---
title: Department Packs
type: spec
status: active
created: 2026-07-02
---

# Department packs

A pack is an optional department capability bundle: the skills, memory scaffolds, templates, and rules a specific business function needs, shipped as one installable unit. The BASE stays lean by design - it carries only the ~21 engine skills every seat needs (memory, routing, quality, research, delivery). Everything department-specific lives here, so every seat only carries skills relevant to their role, and the always-on instruction budget never pays for workflows a seat will never run.

## The packs

| Pack | What it adds | Tier |
|---|---|---|
| `content-marketing/` | Full content production: YouTube packaging/algorithm/chapters, podcast production, LinkedIn, repurposing, trend intel, media prompts, transcription workflows + the content templates | FULL (21 skills) |
| `finance/` | Penny-accurate statement audits + spend/refund/contract approval thresholds, `memory/finance/` scaffold | starter (2 skills) |
| `ops/` | Meeting notes → actions, SOP writing, vendor tracking, weekly ops pulse | starter (4 skills) |
| `sales-crm/` | Cold email writing + pre-outreach prospect dossiers, `memory/pipeline.md` scaffold | starter (2 skills) |

## Pack anatomy

```
packs/<name>/
  pack.md            # the manifest (required) - YAML frontmatter + routing rows
  onboarding.md      # the questions onboarding Phase 5 asks when installing this pack
  skills/<skill>/SKILL.md   # one dir per skill, same format as .claude/skills/
  rules-import/      # optional: on-demand rules the pack adds to .claude/rules-import/
  memory/            # optional: scaffold dirs/files merged into memory/ on install
  templates/         # optional: content templates merged into content-pipeline/templates/
```

### The manifest (`pack.md`)

YAML frontmatter fields:

| Field | Meaning |
|---|---|
| `name` | pack id, must equal the directory name |
| `description` | one paragraph: what the pack is for, who installs it |
| `skills` | the authoritative skill list; must match `skills/` dir contents exactly (lint checks this) |
| `connectors` | connector REQUIREMENTS, expressed generically (e.g. "transcription service") - install prints them as a checklist, it does not wire them |
| `rules_import` | filenames the pack adds to `.claude/rules-import/` (empty list if none) |
| `memory` | scaffold paths (relative to `memory/`) the pack merges in (empty list if none) |
| `templates` | template filenames merged into `content-pipeline/templates/` (empty list if none) |
| `onboarding` | pointer to the pack's onboarding branch file (always `onboarding.md`) |

Body sections:

- `## Routing rows` - the exact table rows the installer appends to `.claude/reference/skills-routing-index.md` (one `| \`skill\` | trigger text |` line per skill).
- `## Rules index rows` - only if `rules_import` is non-empty: the rows appended to `.claude/rules/INDEX.md`.

## Install / uninstall lifecycle

```
node scripts/install-pack.js <pack>              # install
node scripts/install-pack.js <pack> --uninstall  # exact reverse
```

**Install** (all-or-rollback - a failed step reverses everything already applied):

1. Validate: manifest parses, `skills` list matches `skills/` on disk, pack not already in `packs/installed.json`.
2. Pre-flight conflict scan: every target path (`.claude/skills/<skill>`, rules-import files, memory scaffolds, templates, routing rows) must be absent. ANY conflict → clear error listing every collision, nothing touched.
3. Copy skills → `.claude/skills/`, rules-import files → `.claude/rules-import/` (+ append their rows to `.claude/rules/INDEX.md`), memory scaffolds → `memory/`, templates → `content-pipeline/templates/`.
4. Append the manifest's routing rows to `.claude/reference/skills-routing-index.md`.
5. Re-run `node scripts/generate-registry.js`.
6. Append a marked entry to `memory/system_changelog.md` and record the pack (with the exact files and rows it placed) in `packs/installed.json`.

**Uninstall** is the exact reverse, driven by what `packs/installed.json` recorded: remove the copied files, strip the appended rows, remove the marked changelog entry, drop the state entry, regenerate the registry. After uninstall the working tree is byte-identical to before install (`git status --porcelain` clean). If any installed file was modified since install, uninstall refuses with a list (pass `--force` to remove anyway - the modifications are lost, so commit first).

The pack source directory is never touched by install/uninstall; skills are COPIED in, so the pack remains the pristine reference copy.

## Design rules

- **Base stays lean.** A skill earns a base slot only if every seat needs it regardless of role. Department workflows go in a pack, no exceptions.
- **Copy, don't move.** Installed skills are copies; the pack dir is the source of truth for reinstall and for diffing local modifications.
- **Routing rows live in the manifest**, not in the base index, so an uninstalled pack adds zero routing noise.
- **No partial states.** Install is all-or-rollback; uninstall pre-checks everything before removing anything.
- **Lint guards integrity.** `node scripts/os-lint.js` verifies every installed pack's skills are present and routed, and every manifest's skill list matches its `skills/` directory.
- **New packs default to starter size.** 2-4 sharply-scoped skills beat 20 vague ones; grow a pack from real usage.
