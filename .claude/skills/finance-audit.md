---
name: finance-audit
description: Deterministic, penny-accurate audit of the owner's bank statements into a reconciled, categorised financial overview (Google Sheet or report). Use when the owner says "audit my finances", "update the financial spreadsheet", "reconcile my accounts", "categorise my transactions", "what did I spend", "how much revenue", or provides new bank-statement CSVs. Enforces the financial-accuracy rule (numbers from code, never the model).
---

# Finance Audit Skill

Repeatable methodology for turning raw bank-statement exports into a reconciled, categorised
financial picture with ZERO hallucinated numbers. Governed by the financial-accuracy rule
(`.claude/rules/` - numbers come from code, never the model).

## The core pattern (non-negotiable)

1. **The model never types, estimates, or recalls a financial figure.** Every number is COMPUTED by a deterministic script reading the source statement files. If a figure cannot be traced to a script reading a source row, it does not get stated.
2. **Per-wallet balance reconciliation is the pass/fail gate.** For every account+currency wallet: `opening_balance + Σ(signed net per row) == closing_balance` to the penny, where closing balance is the bank's own running-balance figure (ground truth). One wallet fails to tie → the whole audit FAILS and nothing is written anywhere.
3. **Every transaction row carries provenance:** source file + the bank's own transaction ID.
4. **Estimates are labelled ESTIMATED and isolated** - never silently folded into exact totals.

## Account / wallet model (fill in during first audit)

Build this table with the owner before parsing anything. One row per account+currency wallet.

| Wallet | Source file pattern | Native currency | Opens at | Ground-truth closing |
|---|---|---|---|---|
| {{BANK_1}}-{{CCY}} | e.g. `bank1-statement_*.csv` | per file | first known balance | the bank's own running-balance column, latest row |
| {{BANK_2}}-{{CCY}} | ... | ... | ... | ... |
| (manual account) | none (no statement exists) | - | - | manual figure, labelled ESTIMATED |

## Format rules (learn from real data, document here)

Every bank exports differently. During the first audit, profile each format and document it in this section so future runs are deterministic. Things to pin down per source:

- **Column map** - which columns hold date, description, amount, fee, currency, state, running balance, transaction ID
- **Net-per-row formula** - e.g. `Amount − Fee` vs a fee-inclusive `Total amount` column
- **Row filtering** - exclude pending/reverted rows; only completed transactions count
- **Sort order** - newest-first vs oldest-first; sort per currency before running the balance tie
- **FX leg markers** - how the bank represents currency conversions (usually two paired rows)

## Internal-transfer / conversion patterns to net out (the three double-count paths)

1. **Overlapping exports** (old vs new statement files): ingest only ONE authoritative source per period; verify others against it, never sum them.
2. **Currency conversion legs:** match the two FX legs by amount + timestamp, net as Internal Transfer, count once.
3. **Inter-account transfers** (owner moving money between their own accounts): match opposing legs across wallets by amount + date window, flag Internal Transfer, exclude from revenue/expense. Document the owner's self-transfer descriptors (their own name, account nicknames) here once known.

## FX normalisation (anchored, documented)

- Home-currency wallets: native.
- Foreign-wallet inflows in home currency are known from conversion legs (or per-row exchange rates in the source data).
- Foreign card spend → home currency via the wallet's blended in-rate (Σ home-ccy in ÷ Σ native in).
- Never a guessed or "about" rate. Native figures remain the exact truth; the home-currency view is labelled derived.

## Pipeline

0. **Profile** sources (a small script that prints columns, row counts, date ranges per file).
1. **Parse** all formats → unified rows with provenance (`scripts/finance/parse-statements.js` - built during first audit).
2. **Net** internal transfers + dedup conversion legs.
3. **Reconcile** every wallet to the penny (`scripts/finance/verify-finances.js`) - HARD GATE.
4. **Categorise** (deterministic category engine + merchant map maintained in `scripts/finance/`); surface unknowns to the owner - classification is a label, never an amount.
5. **Discrepancy report** vs any existing sheet before overwriting.
6. **Adversarial review:** hunt mislabeled transfers, FX errors, edge cases.
7. **Write** to the sheet via gws CLI (LAST step, only after every check is green), then update `memory/finances.md`.

## Quality gate

Ship only when: every wallet ties to the penny · 0 uncategorised · revenue cross-checked ·
no duplicate transaction IDs · manual figures labelled ESTIMATED · spot-check passed.

## Sub-agents

Sub-agents must NEVER be asked to produce or estimate a financial number. They may review
parser LOGIC, classify merchant categories (labels, not amounts), or hunt for double-count
bugs. All arithmetic stays in deterministic scripts.

## Reference
- Categories + merchant map: maintained alongside the scripts in `scripts/finance/`
- Prior summary: `memory/finances.md`
