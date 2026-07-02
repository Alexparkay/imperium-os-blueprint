---
title: Worker (operating-layer engine)
product: Imperium OS
type: connector-guide
status: dormant-module
created: 2026-07-02
---

# The Worker — activation guide

The worker (`automations/worker/`) is the always-on engine of the operating layer: it pulls data in through connectors, routes every event through one auditable hub, runs the agents, and serves the `/api/*` feed a cockpit dashboard reads. It is the difference between an OS you talk to and an OS that also runs between conversations.

It ships **dormant** — and honestly so: you can run it today, on your machine, with zero credentials, and it serves clearly-labelled sample data end to end. Making it live — real pipes, real agents, somewhere to run — is a **build-team engagement**, not a checklist you're expected to grind through alone.

**Time:** running it dormant takes two minutes (below). Activation is scoped per company — the connectors to YOUR systems are the real work.
**Cost:** your own vendor bills, and they're small: hosting for one small Node service (a few dollars a month on any platform), your Supabase project (see the Brain guide), and model API usage once agents go live (pay-per-use on your own key). No infrastructure is rented on your behalf.

## Try it right now (no keys, no risk)

```bash
cd automations/worker
npm install
node hub.js
```

Then open `http://localhost:8080/api/overview`. Everything you see is sample data from the fictional Meridian universe, and every response says so: `"source": "fixtures"`. Nothing here can touch real money, real messages, or real data — there's nothing configured to touch.

## Keys you'll provide at activation

| Key | What it's for |
|---|---|
| `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` | The Brain (see `docs/connectors/company-brain.md`) — the worker's data home |
| `WORKER_PORT` | Which port the worker listens on (default 8080) |
| `WORKER_TZ` + `ENABLE_CRONS` | Timezone and kill-switch for the daily brief (crons stay OFF unless you explicitly opt in) |
| A hosting choice | Where the worker runs — decided WITH the build team (VPS, container platform, or a machine you already own). Deliberately not pre-decided: no Dockerfile ships |
| Per-connector keys | Added one pipe at a time as connectors to your real systems are written |
| A model API key | Only when the stub agents are upgraded to live model calls |

## The activation checklist (with your build team)

1. **Brain live first** — the worker writes into it (previous guide).
2. **Point the worker at it** — the two Supabase keys in the root `.env`; `"source"` flips from `fixtures` to `supabase`.
3. **First real connector** — pick the highest-value pipe (where does your operational truth live today?) and build it on the `connectors/example-sheets.js` shape: config check → fetch → normalize → status stamp.
4. **Agents go live** — the `[STUB]` knowledge and reporting agents get model calls wired in, same signatures, on your API key.
5. **Hosting** — chosen together, deployed, health-checked.
6. **Crons last, and only if wanted** — `ENABLE_CRONS=true` is an opt-in decision. The OS default is pull over push; plenty of companies never turn this on.

## The guarantees that hold at every stage

- **Every write is audited** — an append-only `audit_log` row, enforced by the database itself.
- **Money / legal / external-comms actions never auto-execute** — they park in the approval queue for a human. Unknown action types are treated the same way (fail closed).
- **No pipe fails silently** — every connector stamps its status on every run.
- **Sample data is always labelled** — `"source": "fixtures"` in every response until the Brain is live.

## What can go wrong

- **The worker won't start after `npm install`.** Check Node is version 20+ (`node --version`). That's the only requirement.
- **Port already in use.** Set `WORKER_PORT` in the root `.env` to a free port.
- **You set the Supabase keys but data looks unchanged.** The Brain is empty until migrations + pipes run — check `/health` shows `"source": "supabase"`, then apply the seed or wire a connector.
- **Something asks you to enable crons early.** Decline until step 6. Dormant modules stay dormant until you decide otherwise.
