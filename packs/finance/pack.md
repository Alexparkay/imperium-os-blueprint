---
name: finance
description: The finance department starter pack. Penny-accurate bank-statement audits (finance-audit) plus explicit approval thresholds for spend, refunds, and contracts (approval-thresholds), with a memory/finance/ scaffold that enforces provenance - every figure traceable to a source file. Install for any seat that touches money; the base financial-accuracy rule (31) stays always-on either way.
skills:
  - approval-thresholds
  - finance-audit
connectors:
  - spreadsheet access for the financial overview (the base gws CLI covers Google Sheets; a local CSV/report fallback needs nothing)
  - a statements drop point - a folder where bank/provider CSV exports land (local folder is fine)
rules_import: []
memory:
  - finance/README.md
templates: []
onboarding: onboarding.md
---

# Finance pack

Two skills and a discipline. `finance-audit` turns raw statement exports into a reconciled, categorised overview with per-wallet penny reconciliation as the pass/fail gate. `approval-thresholds` writes the owner's spend/refund/contract boundaries into memory and enforces "over threshold → human approval" in every answer. The `memory/finance/` scaffold documents the provenance conventions both skills obey.

The always-on financial-accuracy rule (`.claude/rules/31-financial-accuracy.md`) ships in the BASE - numbers come from code and source files even before this pack is installed. The pack adds the workflows that produce those numbers.

Install: `node scripts/install-pack.js finance` · Questions the install asks: `onboarding.md`

## Routing rows

Appended verbatim to `.claude/reference/skills-routing-index.md` on install; removed on uninstall.

| `approval-thresholds` | Define, record, and enforce spend/refund/contract approval boundaries. Trigger on "approval threshold", "spending limit", "approval limit", "can I approve this", "does this need sign-off", "who has to approve", "set up approval rules", or ANY question about whether a spend, refund, discount, or contract can proceed without a human decision |
| `finance-audit` | Deterministic, penny-accurate audit of the owner's bank statements into a reconciled, categorised financial overview (Google Sheet or report). Use when the owner says "audit my finances", "update the financial spreadshee |
