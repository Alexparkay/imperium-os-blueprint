---
title: "MANDATORY: Skill Routing for Complex Tasks"
type: rule
status: active
created: 2026-06-11
---

# MANDATORY: Skill Routing for Complex Tasks

Before doing ANY task manually, check if a skill exists. Use it if so.

## Routing priority

1. **Project skills first** (`.claude/skills/`). They know this repo's structure, paths, and context.
2. **Global skills second** (user scope), if the owner has installed any.
3. **Manual work last**, only if no skill exists.

## How to find the right skill

- The skill listing is loaded into context every session. When you receive a request, scan the available skills for a matching name or description.
- For trigger phrases and the full routing table: read `.claude/reference/skills-routing-index.md`. Do not load it unless you are unsure which skill to use.
- The authoritative skill catalog is generated from disk: `.claude/reference/registry.md` (refresh with `node scripts/generate-registry.js`). Never trust inlined skill counts in prose.
- **Auto-trigger skills:** `quality-gate` (after any significant deliverable), `braindump-router` (per rule 18, on every long conversational prompt).

## When in doubt

If multiple skills could apply, prefer the most specific one. If none clearly fit, do the work manually and tell the owner which skill might want to be created or extended.

If a skill exists for the task, USE IT. Do not improvise a manual workflow.
