# Worker — the operating layer's engine (dormant module)

The worker is the server that pulls data in, runs the agents, and serves the `/api/*` layer any cockpit reads. It sits between the connectors (data sources) and the Brain (`brain/`, Supabase Postgres).

**It ships dormant.** Present, documented, and runnable on fixtures with zero credentials — activated later with your build team (guide: `docs/connectors/worker.md`). Until then it is a working reference implementation of the architecture, not a service you have to run.

## How it fits together

```
 connectors/            hub.js (the hub)                the Brain
 ───────────            ────────────────                ─────────
 example-sheets ──►  webhook intake ──► ROUTER ──► agents (stateless)
 (+ the company's                       (switch)    │  knowledge
  real pipes,                              │        │  reporting
  at activation)                           ▼        │
                                     lib/writes.js ──┴──► Supabase
                                     (audit_log +          (brain/)
                                      approval_queue)
                                          ▲
 cockpit ◄──── /api/overview, /api/* ─────┘
```

- **Hub-and-spoke, no peer-to-peer.** The router in `hub.js` is the only thing that calls agents. Agents (`lib/agents.js`) are stateless functions — they never call each other. One event in, one auditable path through.
- **Every write is audited.** Writes go through `lib/writes.js`, which appends an `audit_log` row. Action types matching money / legal / external-comms rules (`ACTION_POLICY`) are parked in `approval_queue` and NOT executed until a human approves them. Unknown action types fail closed into the queue.
- **Always a status stamp.** Each connector writes `.status/<name>.json` on every run — live, fixtures, or error — so no pipe can fail silently.
- **Agents are stubs until activation.** `knowledge` and `reporting` deterministically format the data they're given and label output `[STUB]`. Model calls are wired at activation with the same signatures.

## Run it (boots with ZERO credentials)

```bash
cd automations/worker
npm install
node hub.js
```

With nothing configured, the worker boots in **fixture mode**: `lib/supabase.js` serves `lib/fixtures.js` — an exact mirror of `brain/seed/seed.sql` (the single-seed-source rule, `brain/seed/MANIFEST.md`) — and **every response carries `"source": "fixtures"`** so sample data can never pass as live.

Then hit it:

```bash
curl http://localhost:8080/health
curl http://localhost:8080/api/overview
curl -X POST http://localhost:8080/webhook/event -H "Content-Type: application/json" -d '{"type":"sync.all"}'
```

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | liveness + data source (`fixtures` / `supabase`) |
| GET | `/api/overview` | the anchor payload: KPIs, documents, approvals, activity, brief, connector status |
| GET | `/api/connectors` | every connector's status stamp |
| GET | `/api/approvals` | pending approval queue |
| GET | `/api/brief` | latest daily brief |
| POST | `/webhook/event` | generic event → router (`{"type":"sync.all"}` etc.) |

## Event types the router handles

`sync.example-sheets`, `sync.all`, `ask.knowledge`, `generate.report`, `write.team_activity`, `propose.action` (the action_type decides direct-write vs approval), `approval.decide`.

## The daily brief (cron)

`cron.js` generates the morning brief and writes it to `daily_brief` through the audited path, with metrics computed in code. It is behind a kill-switch: nothing schedules unless `ENABLE_CRONS=true` (default false — the OS default is pull over push).

```bash
node cron.js --once   # generate one brief right now, ignoring the switch
node cron.js          # start the scheduler (only if ENABLE_CRONS=true)
```

Schedule: `DAILY_BRIEF_AT` (HH:MM, default `07:00`) in `WORKER_TZ` (IANA name, default `UTC`).

## Going live (the activation engagement)

Set in the repo-root `.env` (see `.env.example`, "Operating layer" section):

- `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` — the company's own Supabase project with `brain/` migrations applied (service_role is server-side only, never in a browser)
- `WORKER_PORT`, `WORKER_TZ`, `ENABLE_CRONS` — as needed
- Connector keys for the company's real pipes, added as each connector is written

Full checklist: `docs/connectors/worker.md`.

## Deployment: deliberately not included

There is no Dockerfile or platform config here. Where the worker runs — a VPS, a container platform, a box in the office — is a decision for the activation engagement, made with the company's constraints (cost, region, ops comfort) on the table. Local `node hub.js` is the complete experience until then; committing to a host now would just be a default someone forgets to question.
