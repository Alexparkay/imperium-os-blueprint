# STATUS: client name

<!--
Copy this folder to clients/<client-name>/ when an engagement starts.
This file is the single source of truth for the engagement. Update it the
moment anything changes (call, decision, invoice, delivery). Keep it scannable:
a fresh session should understand the whole engagement from this one file.
-->

- **Status:** lead / active / paused / archived
- **Last contact:** YYYY-MM-DD, what happened
- **Relationship owner:** who internally owns this client

## Engagement

What we're doing for them, in 2-4 bullets. Which offer from `context/offers.md` this maps to.

## Commercials (every figure cites its source)

| Item | Value | Provenance |
|---|---|---|
| Fee / retainer | amount + frequency | signed SoW / contract file in `legal/` |
| Invoiced to date | computed | invoice files / bank export rows |
| Lifetime value | computed | sum of the above, never estimated |

## Stage

Where the engagement is right now: discovery / build / delivery / retained / winding down. One sentence of nuance.

## Next step

The single next action, who owns it, and by when.

## Folder map

- `context/`: scope, stakeholders, open questions, systems inventory
- `legal/`: NDAs, SoWs, contracts
- `research/`: client-specific research
- `deliverables/`: what we've built for them
