---
title: Departments
type: context
status: template
---

<!--
TEMPLATE: org-chart-lite. Filled during onboarding Phase 2 (single-seat) or
maintained in the company's org context repo (org mode - see README.md here).
One row per department. This answers three questions a fresh session cannot
guess: who owns each function, who leads whom, and who signs off on what.
Keep it lite: names and boundaries, not job descriptions.
A fully worked FICTIONAL example follows the template.
-->

# {{COMPANY_NAME}} Departments

## The departments

| Department | Led by | Reports to | Headcount |
|---|---|---|---|
| {{DEPARTMENT}} | name | {{OWNER_SHORT}} / name | n |
| add one row per real function | | | |

Solo or tiny team? One row ("Everything - {{OWNER_SHORT}}") is a legitimate org chart. Don't invent departments that don't exist.

## Who approves what

| Decision | Approver | Notes |
|---|---|---|
| Spend above a threshold | name | state the threshold |
| Anything published publicly | name | content, PR, site changes |
| Client-facing commitments (scope, price, dates) | name | |
| Hiring / firing | name | |
| add the approvals that actually gate work here | | |

## Cross-department seams

Where work hands off between departments and things get dropped. One line each, e.g. "sales closes → ops onboards: handoff doc lives in `clients/<name>/`".

---

## Worked example (FICTIONAL, for shape only, delete after filling in)

# Meridian Consulting Departments

## The departments

| Department | Led by | Reports to | Headcount |
|---|---|---|---|
| Delivery (engagements) | Sam Okafor | Dana Reyes | 6 |
| Sales + partnerships | Dana Reyes | - | 2 |
| Operations + finance | Ravi Nair | Dana Reyes | 3 |

## Who approves what

| Decision | Approver | Notes |
|---|---|---|
| Spend above £2,000 | Dana Reyes | below that, department leads |
| Anything published publicly | Dana Reyes | case studies need client sign-off too |
| Client-facing commitments (scope, price, dates) | Sam Okafor | price changes escalate to Dana |
| Hiring / firing | Dana Reyes | |

## Cross-department seams

- Sales closes → Delivery onboards: kickoff checklist in `clients/<name>/`
- Delivery finishes → Ops invoices: Sam confirms scope shipped before the invoice goes
