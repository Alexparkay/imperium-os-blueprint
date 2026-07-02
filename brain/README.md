# The Brain — the company's operational database (dormant module)

The Brain is a single Postgres database (Supabase) where the company's structured operational data lives. Knowledge documents, the approval queue, the append-only audit log, the daily brief, team activity — one database, one source of truth. Every dashboard, every worker agent, every report is a filter over it. Nothing else is authoritative for structured data.

This module ships **dormant**: the schema, security model, and seed are complete and ready to apply, but nothing in the OS requires a database to run. It activates with your build team when the company is ready for live operational data — see `docs/connectors/company-brain.md`.

## Files

| File | What it does |
|------|--------------|
| `migrations/0001_core.sql` | The universal core tables, check constraints, indexes, and the audit-log append-only guard trigger. |
| `migrations/0002_rls.sql` | Enables + **forces** RLS on every table, default-deny (no policies). |
| `seed/seed.sql` | Clearly-fictional sample data (the Meridian universe) so every surface renders before real data is wired. |
| `seed/MANIFEST.md` | The single-seed-source convention: where sample data may live and who mirrors it. |

## The table contract

Table and column names are a CONTRACT with every consumer — the worker (`automations/worker/`), any cockpit app (`dashboard/README.md`), and any script that reads the Brain. **Never rename a table or column without updating every consumer in the same change.** A rename that ships alone is a silent outage.

The core:

- `documents` — the knowledge base (RAG store): title, body_text or storage_ref, source, doc_type, tags.
- `approval_queue` — proposed actions that money / legal / external-comms rules park for human sign-off (action_type, payload, proposed_by, status pending/approved/rejected, decided_by, decided_at).
- `audit_log` — append-only trail of every write (actor, action, entity, payload). A trigger raises on UPDATE/DELETE; the trail can only be extended.
- `daily_brief` — the generated morning brief (brief_date, content_md, metrics jsonb — metrics computed by code, never typed by a model).
- `team_activity` — what the team is doing / what's blocked (person_ref, activity, entity).

Every table also carries five nullable reserved scoping columns — `company_id`, `entity_id`, `unit_id`, `person_id`, `lifecycle_stage` — for multi-entity / multi-seat scoping later. Single-company installs leave them null; they exist from day one so future access policies never need a backfill.

## Domain extension (how this becomes YOUR company's Brain)

The core is deliberately domain-free. Whatever the company operates on — orders, listings, shipments, projects, placements — those tables are added **per-deployment** as `migrations/0003_<domain>.sql`, following the exact same conventions:

1. Same five reserved scoping columns on every table.
2. Every write path audited through `audit_log`.
3. RLS enabled + forced, default-deny, in the same migration or a paired one.
4. Sample rows in `seed/` (SAMPLE-prefixed, hard-coded UUIDs), registered in `seed/MANIFEST.md`.
5. Names treated as contract: added to the cockpit adapter and the worker in the same change.

The domain migration is the main design act of an activation engagement: it encodes what the company actually operates on.

## Security model (read before touching `0002_rls.sql`)

Every table is **default-deny**: RLS enabled AND forced, with no permissive policy shipped. Consumers read and write server-side with the Supabase **service_role** key, which bypasses RLS by design. The service_role key never reaches a browser.

Per-seat / per-entity read policies are a future addition — the columns they will scope on already exist. When that lands, add SELECT policies keyed to a membership table. **Never add `using (true)`** — that single line would open the Brain to any anonymous client.

## Apply it

Run against the company's own Supabase project (their account, their bill, their data):

```bash
# 1. Link the Supabase CLI to the project (one-time)
supabase link --project-ref <PROJECT_REF>

# 2. Push the schema (runs migrations in order)
supabase db push

# 3. Seed the fictional sample data (optional; skip once real data is wired)
psql "$SUPABASE_DB_URL" -f brain/seed/seed.sql
```

No Supabase CLI? Plain `psql` works too — apply `migrations/0001_core.sql` then `migrations/0002_rls.sql` in order.

The seed uses hard-coded UUIDs, so re-running conflicts on primary keys. Run it against a fresh database or truncate first (note: `audit_log` rows can't be deleted row-wise — the append-only trigger blocks DELETE — use TRUNCATE or re-migrate).

## Replacing the seed with real data

The seed exists so no surface ever shows a blank screen before real data is wired. Once connectors flow real rows in through the worker, delete the seed rows — every value is prefixed `SAMPLE` or labelled FICTIONAL, so they are easy to find. The fixture mirror (`automations/worker/lib/fixtures.js`) stays as-is: it only serves when no database is configured.
