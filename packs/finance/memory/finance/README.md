---
title: memory/finance/ conventions
type: readme
status: active
---

# memory/finance/ - budget-vs-actuals and provenance conventions

Installed by the finance pack. This folder holds the finance department's working memory. Two disciplines govern everything in it:

## 1. Provenance: every figure traceable to a source file

- **No number enters this folder from the model's head.** Every figure is computed by a script (or copied verbatim from a source document) and carries WHERE it came from: source file + the provider's own transaction/row ID.
- A figure that can't be traced to a source row gets labelled **[UNVERIFIED]** and never silently folds into totals.
- Manual figures (a balance with no statement) are allowed but always labelled **ESTIMATED**, isolated from exact totals.

## 2. Penny reconciliation: the pass/fail gate

- For every account+currency wallet: `opening_balance + sum(signed net per row) == closing_balance` to the penny, where the closing balance is the provider's own running figure (ground truth).
- A wallet that doesn't tie to the penny FAILS the audit and nothing gets written anywhere - no "close enough".
- Three double-count paths stay closed: overlapping exports (ingest ONE authoritative source), currency-conversion legs (net as internal transfer, count once), inter-account transfers (match opposing legs, exclude from revenue/expense).

## Files that live here

| File | What | Written by |
|---|---|---|
| `approval-thresholds.md` | The owner's spend/refund/discount/contract limits | approval-thresholds skill (setup interview) |
| `approval-log.md` | One line per money decision: date, category, amount, under/over, outcome | approval-thresholds skill |
| `budget-vs-actuals.md` | Period budgets next to script-computed actuals, variance flagged | finance-audit runs (actuals) + owner (budgets) |
| `audits/YYYY-MM-DD-<scope>.md` | Dated audit outputs with their reconciliation PASS/FAIL record | finance-audit skill |

Budget figures are the ONE owner-typed number class in here - they're targets, not claims about reality, so they need intent, not provenance. Actuals next to them follow rule 1 fully.

## Related

- `.claude/rules/31-financial-accuracy.md` (the always-on enforcement rule)
- `memory/finances.md` (the base top-level financial memory file; this folder is the department detail behind it)
