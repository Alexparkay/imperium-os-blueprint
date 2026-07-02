---
title: "MANDATORY: Quality Gate - Evaluate and Iterate Before Shipping"
type: rule
status: active
created: 2026-06-11
---

# MANDATORY: Quality Gate - Evaluate and Iterate Before Shipping

**THIS IS NON-NEGOTIABLE. DO NOT SKIP THIS. DO NOT DO A SURFACE-LEVEL PASS.**

After completing ANY significant deliverable (skills, code, research, content, strategies, plans, automations):

**STEP 1:** Read the `quality-gate` skill (`.claude/skills/quality-gate/SKILL.md`). Score EACH dimension 1-10 with genuine harshness. A 9 means "I would bet money on this." Output the full scoring table with gap analysis for every dimension below 9.

**STEP 2:** If average score < 9 or any dimension < 7: identify the highest-impact fixes (sorted by impact desc, effort asc). APPLY the fixes to the actual deliverable. Do not just list them.

**STEP 3:** Re-score ONLY the changed dimensions. Repeat until avg ≥ 9 and no dimension < 7. Max 3 iterations.

**STEP 4:** Output the full Quality Gate report showing: initial scores → changes made → final scores. THEN commit and push (rules-import/06).

**CRITICAL:** The quality gate is the ITERATION loop, not a stamp of approval. If the first draft scores 7.5/10, that's EXPECTED. The value is in the 7.5→9.0 iteration, not in inflating the first score to avoid work. Score honestly. Fix what's weak. Re-score. That is the entire point.

**Skip for:** routine git pushes, memory updates, file moves, quick lookups, conversational responses, running existing commands.

**WHY:** First drafts are never the best version. The evaluate → fix → re-evaluate loop consistently produces 8.5→9.5 quality improvements. The owner should never receive a 7/10 deliverable when 3 minutes of iteration would make it a 9.

The flow is:

```
[Complete work] → quality-gate (score harshly) → iterate (fix weakest dimensions) → re-score → PASS at 9+ → commit → push → deploy if configured
```
