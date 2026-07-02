---
name: company-strategy
description: Use when designing the company's offers, pricing deals, preparing for sales calls, handling objections, qualifying prospects, structuring revenue share, or making strategic decisions for {{COMPANY_NAME}}. Trigger on offer design, pricing, sales call, objection handling, revenue share, client qualification, funnel design, deal structure.
metadata:
  title: Company Strategy - Offer Architecture + Client Acquisition
  tags:
    - "system"
  type: skill
  status: active
  created: 2026-04-02
  updated: 2026-06-11
---

# Company Strategy - Offer Architecture + Client Acquisition

## Source Files (Read When Activated)

- `context/offers.md` - the company's current offer ladder and pricing (built in onboarding Phase 2)
- `context/company.md` - business model, positioning, stage
- `memory/business/` - strategy docs, sales-system notes, improvement audits as they accumulate

Never quote a price, case study, or qualification band that isn't in these files. If the files are thin, say so and help the owner fill them in instead of inventing numbers.

## The Offer Ladder Framework

Structure the company's offers as an ascension ladder. Every tier feeds the next:

| Tier | Role | Example shape |
|------|------|---------------|
| Free | Audience + trust | Content, newsletter, community |
| Low-ticket | Qualify buyers, fund acquisition | Playbook, sprint, template pack [EXAMPLE] |
| DWY (done-with-you) | Mid-ticket transformation | Multi-week accelerator or cohort [EXAMPLE] |
| DFY (done-for-you) | Premium / performance | Embedded partnership, retainer, or revenue share [EXAMPLE] |
| Community / Mastermind | Retention + LTV | Paid peer group [EXAMPLE] |

Fill the actual tiers and prices from `context/offers.md`. When designing a new tier, check: does it ascend naturally from the tier below, and does it have a clear next step above?

## Sales Call Structure (90-min Audit-to-Close)

The diagnostic sell: run an audit ON the call so the proposal writes itself.

1. **Current State Analysis (30 min)** - revenue, growth, acquisition channels, conversion rates
2. **Hidden Problems Diagnosis (30 min)** - lead leakage, conversion math, operational chaos
3. **Opportunity Quantification (20 min)** - revenue impact of fixing the top problems, cost of inaction
4. **Proposal from findings** - the offer maps directly to the diagnosed gaps

## Objection-Handling Patterns

| Objection | Response pattern |
|-----------|------------------|
| **Credibility ("why you?")** | Show the flagship case study with concrete metrics from `memory/business/` or `clients/`. Results, not biography. Never fabricate a case study. |
| **"What does [the product] actually do?"** | Name the concrete mechanism (e.g. "sales process automation"), then show a before/after |
| **"Burned by agencies before"** | Risk reversal: tie payment to results where the offer allows it ("no results = no payment") |
| **"Too expensive"** | Reframe to cost of inaction: "What's it costing you NOT to fix this? You're losing [diagnosed number] per month" |
| **"Need to think about it"** | Freedom Close: "Totally free to say no. What specifically concerns you?" Surface the real objection |

## Qualification: Take vs Walk Away

Define explicit take/walk bands from the company's ICP ({{ICP}}) and keep them in `context/offers.md`. The framework:

**Take:** revenue inside the ICP band, established (not pre-revenue), growth mindset, a clear bottleneck you can fix, speaking to the decision-maker
**Walk:** well below the ICP band, "just exploring", micromanager profile, no identifiable bottleneck, committee decisions with no champion

Walking away from bad-fit deals is a strategy decision, not a sales failure.

## Turning an Audit into a Priority List

After any internal or client audit, compress findings into a top-3 action list, ranked by (impact x speed). Example shape:

1. Systematise the constraint function (e.g. train 1-2 operators to take sales off the founder)
2. Increase content volume on the highest-performing channel with a fixed mix (educational / case studies / thought leadership / promo)
3. Fix onboarding (structured first 30 days: welcome, first deliverable, strategy call, community)

---

## Related

- [[client-delivery]]
- [[cold-email-writer]]
- [[creator-oracle]]
