---
title: "MANDATORY: Financial Accuracy - Numbers Come From Code, Never From The Model"
type: rule
status: active
created: 2026-06-11
---

# MANDATORY: Financial Accuracy - Numbers Come From Code, Never From The Model

Any task touching the owner's finances (financial overviews, bank-statement audits, tax prep, revenue/expense/burn figures, account balances) MUST obey these rules. The requirement: 100% accurate, no hallucinated numbers, no double-accounting errors. This is enforced structurally, not by trust.

## Hard rules

1. **The model never types, estimates, or recalls a financial figure.** Every number that lands in a sheet, report, or chat answer about the owner's finances must be COMPUTED by a deterministic script reading the source CSV/statement files. If a figure cannot be traced to a script reading a source row, it does not get stated.

2. **Per-wallet balance reconciliation is the pass/fail gate.** For every account+currency wallet, `opening_balance + Σ(signed net per row) == closing_balance` to the penny, where `closing_balance` is the bank's own running-balance figure (ground truth). If a wallet does not tie to the penny, the audit FAILS and nothing is written anywhere.

3. **No double-counting. Three closed paths:**
   - Overlapping exports (old vs new): ingest only ONE authoritative source; verify others against it, never sum them.
   - Currency conversion legs: net as Internal Transfer, count once.
   - Inter-account transfers: match opposing legs, flag Internal Transfer, exclude from revenue/expense.

4. **Every transaction row carries provenance:** source file + the bank's own transaction ID. Any number must be traceable back to one exact source row.

5. **FX normalisation is anchored, never invented.** Foreign spend is converted using rates present in the source data (conversion-leg amounts or per-row exchange rates), via a documented method. Never a guessed or "about" rate. Native-currency figures are the exact truth; normalised figures are clearly labelled as derived.

6. **Estimates are labelled ESTIMATED and isolated.** Manual figures with no statement behind them must always be labelled ESTIMATED and never silently folded into "exact" totals.

7. **A standalone verification script** must re-run all checks (balance ties, duplicate scan, revenue cross-check, zero-uncategorised, transfer netting) and print PASS/FAIL. Writing to any sheet or report is the LAST step, only after every check is green.

## Sub-agents

Sub-agents must NEVER be asked to produce or estimate a financial number. They may review parser LOGIC, classify merchant categories (labels, not amounts), or hunt for double-count bugs. All arithmetic stays in deterministic scripts.

## Where the numbers live

Source statements and audit scripts are configured per install. Keep raw statements out of git (see `.gitignore`) and keep audit scripts in `scripts/`.
