---
title: Finances
type: reference
status: active
sensitivity: high
---

<!--
HARD RULE (financial accuracy): every number in this file must be COMPUTED by a
deterministic script reading source data (bank exports, invoices, accounting
exports), never typed, estimated, or recalled by the model. Each figure carries
provenance: the source file + the row/ID it came from. Per-account balances must
reconcile to the source's own running balance before anything is written here.
Manual figures are allowed only when no source exists, and must be labelled
ESTIMATED and kept out of exact totals. See the financial-accuracy rule in
.claude/rules/.
-->

# Finances: {{COMPANY_NAME}}

## Accounts

| Account | Currency | Source of truth | Last reconciled |
|---|---|---|---|
| (example) Main business account | GBP | `path/to/statement-export.csv` | YYYY-MM-DD |

## Current position

(written by the finance scripts, not by hand)

| Figure | Value | Provenance | As of |
|---|---|---|---|
| (example) Cash on hand | computed | script + source file + row IDs | YYYY-MM-DD |

## Revenue

| Client / source | Model | Amount | Provenance |
|---|---|---|---|
| (example) Client A | retainer | computed | invoice file / bank row ID |

## Recurring costs

| Cost | Amount | Frequency | Provenance |
|---|---|---|---|

## Estimates (clearly labelled, never folded into exact totals)

| Figure | Value | Why no source exists |
|---|---|---|

## Notes

- This file is sensitive. It is never summarised into `context/` and never quoted in content.
- When a finance question can't be answered from a script output, the answer is "needs a reconciliation run", not a guess.
