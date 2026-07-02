---
title: Sales pipeline
type: schema
status: active
---

# memory/pipeline.md - the deal board

Installed by the sales-crm pack. ONE file tracking every open deal from first touch to close. The weekly review reads it; prospect-intel and cold-email-writer write to it. Keep it current - a pipeline file that lags reality is worse than none, because it gets trusted.

## Schema

One row per deal. Stages are fixed vocabulary - don't invent new ones, rename these once (deliberately) if the owner's sales motion differs:

`lead → contacted → replied → call-booked → proposal → negotiation → won | lost | parked`

| Prospect | Company | Stage | Value | Next step | Owner | Last touch | Dossier |
|---|---|---|---|---|---|---|---|

Column rules:

- **Prospect / Company** - names as in `memory/people/<kebab-name>.md`; the Dossier column links there
- **Stage** - from the fixed vocabulary only
- **Value** - expected deal value with currency; `?` until quoted, `[UNVERIFIED]` if estimated (rule 31 applies the moment a figure might be repeated as fact)
- **Next step** - a verb with a date ("send proposal by Fri"), never "waiting". If the next step is theirs, write "their move since <date>" so staleness is visible
- **Last touch** - date of the most recent real contact either direction
- **Won** → create `clients/<name>/` (copy `clients/_TEMPLATE/`), move delivery truth there, mark the row `won` with close date
- **Lost / parked** → one-line reason in the log below; reasons are the cheapest sales research that exists

## Log

Dated one-liners for stage changes, wins, losses, and reasons. Newest first.

## Hygiene

- Every open deal has a Next step. A row without one is flagged by any weekly review.
- 14+ days without a touch on an active deal = stale; surface it.
- Deal values follow provenance discipline: quoted figures from the actual quote/proposal doc, never from recall.
