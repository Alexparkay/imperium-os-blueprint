---
title: Offers
type: context
status: template
---

<!--
TEMPLATE: filled during onboarding Phase 2.
One section per offer. Every live client folder in clients/ should map to exactly
one offer here. If a client doesn't map, either the offer list is stale or the
engagement is custom (say so in their STATUS.md).
A fully worked FICTIONAL example follows the template.
-->

# {{COMPANY_NAME}} Offers

## Offer 1: {{OFFER}}

- **Who it's for:** which slice of {{ICP}}
- **What they get:** the deliverable in plain language
- **Commercial model:** one-off / retainer / commission, price band
- **Delivery:** who does the work, how long it takes, what done looks like
- **Status:** live / in development / sunset

## Offer 2: name

Same fields as above. Add or delete offer sections to match reality.

## How offers map to clients

| Client | Offer | Notes |
|---|---|---|
| `clients/<name>/` | Offer 1 | one line of nuance if any |

---

## Worked example (FICTIONAL, for shape only, delete after filling in)

# Meridian Consulting Offers

## Offer 1: Ops Diagnostic

- **Who it's for:** logistics ops directors who know money is leaking but not where
- **What they get:** a 6-week deep-dive producing a leak map, a quantified fix list, and one fix implemented as proof
- **Commercial model:** fixed fee, £18-30k depending on company size
- **Delivery:** 1 senior consultant + 2 analysts on site 2 days/week; done = fix list signed off and first fix live
- **Status:** live, flagship

## Offer 2: Ops Health Retainer

- **Who it's for:** diagnostic clients who want the fix list executed and kept fixed
- **What they get:** monthly fix sprints, a quarterly ops health report, on-call process support
- **Commercial model:** retainer, £6-12k/month, 6-month minimum
- **Delivery:** named consultant pair per client; done = agreed sprint scope shipped each month
- **Status:** live, 60% of diagnostic clients convert

## How offers map to clients

| Client | Offer | Notes |
|---|---|---|
| `clients/northgate-logistics/` | Ops Health Retainer | converted from Q1 diagnostic |
| `clients/coldspan/` | Ops Diagnostic | week 3 of 6 |
