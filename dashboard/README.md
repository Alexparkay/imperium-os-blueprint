# The Cockpit Contract

This folder is a CONTRACT, not an app. Any dashboard ("cockpit") built for this OS — by the build team at activation, or by anyone later — MUST satisfy the rules below. The cockpit is a read-only window over the operating layer; the Brain (`brain/`) and the repo's files stay the source of truth.

Build it on demand, with the owner, once there is real data to show. An empty shell built early decays; a cockpit built against live pipes gets opened.

## 1. One data-source adapter, config-over-code

All reads go through a SINGLE typed data-source adapter. No component queries a backend directly. The active source is configuration, not code:

```
DATA_SOURCE=mock | sheets | supabase
```

Switching source is an env change and a redeploy — never a refactor. The adapter exposes the same typed interface in every mode; components cannot tell (and must not care) which backend is live.

## 2. `supabase` mode binds to the Brain table contract

In `supabase` mode the adapter reads the five core tables defined in `brain/migrations/0001_core.sql`:

- `documents` · `approval_queue` · `audit_log` · `daily_brief` · `team_activity`

plus any per-deployment domain tables (`0003_<domain>.sql` — orders, listings, shipments, whatever this company operates on). Table and column names are a contract shared with the worker: **never rename on either side without updating the other in the same change.** Access is server-side with the service_role key only; the key never reaches the browser (RLS is default-deny by design — see `brain/README.md`).

## 3. Mock mode derives from the seed — and says so, loudly

- Mock data MUST derive from `brain/seed/seed.sql` (the single-seed-source rule, `brain/seed/MANIFEST.md`) — the same rows the worker's fixtures mirror. Inventing mock data in the cockpit is a violation.
- Every surface showing non-live data MUST render a visible **"SEED DATA"** badge. Not a console log, not a footnote — a badge on the surface itself.
- **Silent mock data is the named failure mode this contract exists to prevent.** A screen of plausible numbers with no badge will, eventually, be read as truth by someone making a decision.

## 4. Fall back, never blank

An unconfigured or unreachable backend falls back to mock mode (badged), never to a blank screen or an unhandled error. Connector state comes from the worker's `/api/connectors` status stamps, so a dead pipe renders as "pipe down since <time>", not as missing data.

## 5. Standing rules

- **Read-only first.** Writes (approving a queue item, adding a note) go through the worker's audited endpoints — never direct table writes from the cockpit.
- **Financial figures** render only with provenance, per the financial-accuracy rule; anything unverified shows as "needs reconciliation", never a guess.
- **Access control from day one:** this is company-private data — authentication or platform access protection, minimum.
- Framework, host, and styling are free choices. The contract governs data flow, not aesthetics.
