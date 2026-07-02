---
title: Quality Gate - Evaluate, Score, Iterate
tags:
  - "system"
type: skill
status: active
created: 2026-04-02
updated: 2026-06-11
description: "Self-evaluation and iteration loop for ALL significant deliverables. Scores work 1-10 across relevant dimensions, identifies specific point-gains to reach 9+, then iterates until quality threshold is met. MUST trigger after completing ANY substantial output - skills, code, research reports, content drafts, strategies, plans, scripts, templates, automations, or any deliverable the owner will use. Does NOT trigger for routine operations (git push, memory updates, file moves, quick lookups). Trigger on \"evaluate this\", \"is this good enough\", \"rate this\", \"quality check\", \"iterate on this\", or automatically after any deliverable that took >5 minutes to produce."
name: quality-gate
---

# Quality Gate - Evaluate, Score, Iterate

You are the quality control system. After producing any significant deliverable, you MUST run this evaluation loop before declaring the work done. The goal: nothing ships below 9/10.

## When This Triggers

**ALWAYS evaluate (auto-trigger):**
- Skills created or modified
- Code files or automations built
- Research reports or analysis documents
- Content drafts (video scripts, newsletters, LinkedIn posts)
- Strategy documents or plans
- Templates or frameworks
- Any deliverable that took >5 minutes of focused work

**DON'T evaluate (skip):**
- Routine git push / memory updates / file organisation
- Quick lookups or single-fact answers
- Conversational responses
- Running existing commands

## Step 0: Definition of Done (Before Starting Work)

Before beginning any significant deliverable, define 3-5 concrete acceptance criteria. This prevents post-hoc rationalisation where criteria get invented to justify whatever was produced.

Example: "This video script is DONE when: (1) hook is under 15 seconds, (2) the primary ICP would forward it, (3) CTA is specific with a URL, (4) no banned words from voice-check, (5) concept scores ≥ 80 on video-score."

Write these down BEFORE starting. Evaluate against them AFTER finishing.

**Why this matters (Anthropic's research):** Without pre-defined criteria, agents "move the goalposts" mid-build and declare incomplete work as done. Contract negotiation before work starts prevents this.

## Context Anxiety Guard

**If context is above 60%, compact BEFORE running the quality gate.** Never evaluate in a depleted context window. Anthropic found that models rush through evaluation as context fills - they approve work faster and catch fewer issues. The quality gate deserves full attention, not end-of-session speed-running.

## Adversarial Evaluation Option

For high-stakes deliverables (skills, core automations, content that will be published), spawn a separate **evaluator agent** instead of self-evaluating. A separate agent has no sunk-cost bias toward the work and will find what the generator missed.

```
[Complete work] → spawn evaluator agent with: deliverable + definition of done + type → receive feedback → iterate → PASS
```

For lower-stakes work (quick scripts, memory updates, internal docs), self-evaluation with the framework below is sufficient.

## The Evaluation Framework

### Step 1: Identify the Deliverable Type

The scoring dimensions change based on what was produced:

**Code / Automation:**
- Correctness (does it work?)
- Edge cases (what breaks it?)
- Error handling (fails gracefully?)
- Readability (could someone else maintain this?)
- Integration (fits existing patterns in the repo?)
- Documentation (clear usage instructions?)

**Skill / Framework:**
- Completeness (covers all scenarios?)
- Weighting accuracy (priorities reflect reality?)
- Actionability (clear enough to execute consistently?)
- Specificity (binary checks vs vague judgment?)
- Integration (plugs into existing workflow?)
- Data usage (leverages what's available?)

**Research / Report:**
- Evidence quality (sourced, not speculated?)
- Completeness (answered the actual question?)
- Actionability (clear next steps?)
- Bias check (considered counterarguments?)
- Relevance (filtered for the owner's specific situation?)

**Content Draft:**
- Voice match (sounds like the owner, not AI?)
- ICP alignment (serves the target audience?)
- Specificity (concrete numbers, names, examples?)
- Structure (hook → value → CTA?)
- Shareability (would the ICP forward this?)

**Strategy / Plan:**
- Feasibility (can the owner actually execute this?)
- Prioritisation (most impactful actions first?)
- Specificity (dates, numbers, owners, not vague direction?)
- Risk awareness (what could go wrong?)
- Measurement (how do you know it worked?)

### Step 2: Score Each Dimension

For each relevant dimension, score 1-10:

```
DIMENSION          SCORE   GAP ANALYSIS
─────────────────  ─────   ─────────────
[Dimension 1]      X/10    [What's missing for 10/10]
[Dimension 2]      X/10    [What's missing for 10/10]
[Dimension 3]      X/10    [What's missing for 10/10]
...
─────────────────  ─────
AVERAGE:           X/10
LOWEST:            X/10    ← This is the bottleneck
```

**Scoring calibration:**
- **10/10** - Cannot identify a meaningful improvement. Would bet money on this.
- **9/10** - One minor improvement possible but wouldn't change the outcome.
- **8/10** - Solid work. A few tweaks would make it notably better.
- **7/10** - Good but has gaps that could cause problems.
- **6/10** - Functional but has clear weaknesses.
- **5/10** - Mediocre. Missing important elements.
- **≤4/10** - Needs fundamental rework.

### Step 3: Identify Point-Gains

For each dimension below 9, list:
```
[DIMENSION]: X/10 → target 9/10
  Fix: [Specific action that would raise the score]
  Impact: [+X points, what changes]
  Effort: [Quick / Medium / Significant]
```

Sort by: impact descending, then effort ascending (highest impact, lowest effort first).

### Step 4: Iterate

1. Apply fixes starting with highest-impact, lowest-effort
2. Re-score ONLY the dimensions that were changed
3. If average ≥ 9 AND no dimension below 7 → **PASS**
4. If any dimension still below 7 → fix that bottleneck first
5. Max 3 iterations. If still below 9 after 3 rounds, flag to the owner: "Best I can get to is X/10. Here's what's limiting it: [explanation]. Want me to continue or is this acceptable?"

### Step 5: Report

After passing (or flagging), output:

```
═══════════════════════════════════════
  QUALITY GATE: [PASS / FLAG]
═══════════════════════════════════════

Deliverable: [What was produced]
Type: [Code / Skill / Research / Content / Strategy]
Iterations: [X]

Final Scores:
  [Dimension 1]:  X/10  (was X/10)
  [Dimension 2]:  X/10  (was X/10)
  [Dimension 3]:  X/10  (was X/10)
  ─────────────
  Average:        X/10
  Lowest:         X/10

Changes made during iteration:
  1. [What was fixed and why]
  2. [What was fixed and why]

Remaining limitations:
  - [Anything that can't be fixed now but should be noted]
```

## Behaviour Rules

1. **Be genuinely harsh.** A 9 means "I would bet money on this." Don't inflate scores to avoid iteration work. The whole point is to catch gaps BEFORE the owner relies on the output.

2. **Score the DELIVERABLE, not the effort.** 10 hours of work on a mediocre result is still mediocre. 30 minutes on a perfect result is still perfect.

3. **The bottleneck dimension matters most.** An average of 9 with one dimension at 5 is worse than an average of 8 with all dimensions at 8. Fix the weakest link first.

4. **Don't add unnecessary complexity to reach 10.** If a dimension is at 8 and the only way to reach 9 is adding something that makes the deliverable harder to use, DON'T. Simplicity is a feature. Score the simplicity dimension too.

5. **For content: reference the voice profile.** Always check against `content-pipeline/voice-profile/` (built during onboarding Phase 3). AI smell = automatic cap at 7/10 on voice match.

6. **For code: actually test it.** Don't score correctness without running the code. "Looks right" is not 9/10 - "ran it and it works" is.

7. **Interact with the output, don't just read it.** For content: mentally read aloud, check word count. For strategies: verify each action has a date, owner, and metric. For skills: dry-run a real scenario. The evaluator must DO something with the deliverable, not just scan it. (Anthropic found that superficial testing misses subtle bugs.)

8. **Context matters.** A quick utility script doesn't need the same rigour as a core automation that runs 24/7. Adjust the number of dimensions and the pass threshold to match the stakes. But ALWAYS evaluate.

## Integration With Existing Workflow

This skill runs at the END of task completion, BEFORE the final commit/push:

```
[Do the work] → quality-gate evaluation → iterate if needed → final commit → push to GitHub
```

It lives alongside the existing rules:
- Content voice rule - quality-gate includes voice as a dimension for content
- Push + deploy rule - quality-gate runs BEFORE push
- Google Docs formatting rule - quality-gate evaluates Doc formatting quality if applicable

## Self-Evaluation of This Skill

This skill must pass its own framework:

| Dimension | Score | Notes |
|-----------|-------|-------|
| Completeness | 9/10 | Covers all deliverable types, has clear skip criteria |
| Actionability | 9/10 | Binary steps, specific scoring calibration |
| Specificity | 8/10 | Some dimensions are inherently subjective (voice match) - unavoidable |
| Integration | 9/10 | Clear placement in workflow, doesn't conflict with existing rules |
| Overhead | 9/10 | Lightweight for small deliverables, thorough for big ones. Smart skip criteria prevent over-evaluation |
| Honesty mechanism | 9/10 | Calibration guide, bottleneck-first approach, max iteration cap |
| **Average** | **8.8/10** | |

Remaining limitation: The scoring calibration is based on judgment, not data. After 20+ evaluations, review whether scores correlate with the owner's satisfaction. If 9/10 deliverables keep getting "actually this needs changes," the calibration is off - adjust downward.

---

## Related

- [[braindump-router]]
- [[voice-check]]
- [[video-score]]
