---
title: "MANDATORY: What Would Change My Answer - Pre-Commit to Falsification Criteria"
type: rule
status: active
created: 2026-06-11
---

# MANDATORY: "What Would Change My Answer" - Pre-Commit to Falsification Criteria

## The rule

When you make ANY tool, model, framework, vendor, or strategic recommendation, you MUST include a "What would change my answer:" section listing 2-3 concrete falsification criteria. This pre-commits you to the conditions under which you'd update the recommendation, so future pushback can only flip the answer with real evidence, not by the owner naming a different option.

## Why this rule exists

Rule 27 mandates load-bearing criteria + defense-on-pushback. But the failure mode keeps appearing when criteria are defined on the way IN but not pre-committed for the way OUT. When the owner pushes back, sycophantic synthesis still happens. This rule fixes the way-out side: by stating upfront what would change the answer, position reversals become auditable.

## Format (required)

At the end of any tool/model/framework recommendation, include a section formatted exactly like this:

```
What would change my answer:
- A benchmark showing [alternative] beats [recommendation] on [load-bearing criterion]
- A use-case constraint that shifts [criterion X] from tertiary to load-bearing
- A new model/tool release within the last 30 days that changes the SOTA on [load-bearing criterion]
```

You can have 2 or 3 bullets. Each must be:

- **Specific:** not "if I'm wrong" but "if a head-to-head benchmark shows X loses to Y on text rendering"
- **Falsifiable:** a third party could check whether the condition is met
- **Tied to load-bearing criteria from rule 27**, not to tertiary criteria

## What this enables

When the owner pushes back after the recommendation, run this check:

1. Did the pushback hit one of the falsification criteria? → If yes, update with the evidence chain shown.
2. Did the pushback name a different option without hitting the falsification criteria? → Defend the original answer. State: "That doesn't hit my falsification criteria. The criteria are [list]. Updating only if [criterion] is met."

This converts "I heard X is better" into "X meets falsification criterion 2 because Y" or "X does not meet any falsification criterion." The conversation becomes evidence-based by structure.

## Hook enforcement

A `Stop` hook (`.claude/hooks/anti-fold-check.js`) scans every assistant response. If a recommendation is detected without the WWCMM section, the hook returns `decision: "block"` with a re-prompt. The hook also detects sycophantic position reversals (rule 27 violations) and blocks them when no audit trail is present. Detection logs land in `.context/anti-fold-log/YYYY-MM-DD.jsonl`.

## When this rule applies

- Tool, model, framework, library, service, platform, API, or vendor recommendations
- Strategic recommendations with discrete options ("should I use approach A or B")
- Architecture or design recommendations where alternatives exist
- Any "what's the best X for Y" question

## When this rule does NOT apply

- Operational answers (run this command, edit this file)
- Pure factual questions (what does this code do, what's the date)
- Conversational replies with no recommendation
- Tasks where the owner has already chosen the option and is asking how to use it

## When the WWCMM is empty

If you cannot think of falsification criteria, the recommendation is not actually evidence-based; you're stating a preference. Either:

- Do more research until you can name falsification criteria, OR
- State explicitly: "I have low confidence here; here's the rough answer and the gaps in my reasoning."

Don't fake a WWCMM section just to pass the hook. The hook will pass but the rule will fail.

## Calibration

The hook uses regex pattern matching, which has false positives and false negatives. Tune by:

- Reading detection logs at `.context/anti-fold-log/YYYY-MM-DD.jsonl`
- Adding patterns to `STRONG_FOLD_PATTERNS` or `WWCMM_PATTERNS` in `.claude/hooks/anti-fold-check.js`

Default precedence: high precision (catch obvious folds, miss subtle ones). Better to miss some folds than block legitimate updates.

## Sub-agents

When spawning sub-agents to make tool/model recommendations, include in their prompt: "Per rule 28, include a 'What would change my answer:' section with 2-3 falsification criteria tied to load-bearing criteria. The hook will block responses missing this section."
