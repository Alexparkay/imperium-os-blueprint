# Clients

Every client engagement gets its own folder: `clients/<client-name>/` (kebab-case). Copy `_TEMPLATE/` to start one; it carries the standard internal structure so any session (or sub-agent) can orient inside a client folder without guessing.

## The per-client pattern

```
clients/<client-name>/
├── STATUS.md        # the single source of truth: stage, commercials, next step
├── README.md        # 1-pager: who they are, what they pay for, who owns the relationship
├── context/         # scope, stakeholders, systems inventory, discovery notes
├── legal/           # NDAs, MSAs, SoWs, contracts (PDFs + markdown drafts)
├── research/        # client-specific research and analysis
└── deliverables/    # what we built for them (apps, dashboards, docs, decks)
```

Rules of the pattern:

- **STATUS.md is always current.** After any client call, decision, invoice, or delivery, update it in that session.
- **Commercials carry provenance.** Any money figure in a STATUS.md cites its source (signed SoW, invoice file, bank row), per the financial-accuracy rule. No remembered numbers.
- **Client work never lives in memory/.** Memory holds your company's knowledge; client artifacts live here.

## Prospects

Not-yet-clients live in `clients/_prospects/<name>/` with just a STATUS.md (stage: lead / qualified / proposal sent / negotiating). When they sign, move the folder up to `clients/<name>/` and expand it from `_TEMPLATE/`. When they go cold, note why in STATUS.md and leave the folder in `_prospects/` as institutional memory.

## Archiving

When an engagement ends, move the whole folder to `clients/_archive/<name>/` and set STATUS.md to archived with the end date and final state. Never delete; old engagements are reference material for proposals and case studies.
