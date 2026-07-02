---
name: sales-crm
description: The sales department starter pack. Research-backed cold email writing (cold-email-writer) plus pre-call/pre-outreach prospect dossiers assembled from public sources (prospect-intel), with a memory/pipeline.md schema for tracking deals from first touch to close. Install for any seat that hunts or closes; the base owns delivery once the deal lands (client-delivery).
skills:
  - cold-email-writer
  - prospect-intel
connectors:
  - web search/research access for prospect intelligence (base tooling covers this)
  - optional email sending platform for sequences (drafts are produced regardless; nothing sends without approval)
rules_import: []
memory:
  - pipeline.md
templates: []
onboarding: onboarding.md
---

# Sales & CRM pack

The top of the funnel. `prospect-intel` builds the dossier before any touch; `cold-email-writer` turns it into outreach that reads human; `memory/pipeline.md` keeps every deal's stage, next step, and owner in one file the weekly review can read. Handoff on close: winner gets a `clients/<name>/` folder and the base `client-delivery` skill takes over.

Install: `node scripts/install-pack.js sales-crm` · Questions the install asks: `onboarding.md`

## Routing rows

Appended verbatim to `.claude/reference/skills-routing-index.md` on install; removed on uninstall.

| `prospect-intel` | Pre-call/pre-outreach dossier on a prospect (person + company) assembled from public sources into memory/people/. Trigger on "research [prospect] before the call", "prospect intel on", "who am I meeting", "brief me on [company/person]", "prep for my call with", or before writing any cold outreach to a named prospect |
| `cold-email-writer` | Write high-converting cold emails using a research-backed 2026 framework. Combines Nick Saraev ($15M via outbound, 7 psychological principles, anti-AI detection), Eric Nowoslawski (8M emails/month, Creative Ideas campaig |
