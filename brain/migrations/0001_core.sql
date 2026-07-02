-- ============================================================
-- Company Brain — core schema
-- Migration 0001 — universal core tables, constraints, indexes
-- Target: Postgres / Supabase (apply via `supabase db push` or psql)
-- ============================================================
-- The Brain is the single Postgres database where the company's
-- structured operational data lives. Every cockpit surface and
-- every worker agent is a filter over these tables.
--
-- ONLY the universal core ships here: knowledge documents, the
-- approval queue, the append-only audit log, the daily brief,
-- and team activity. Domain tables (whatever this company
-- operates on: orders, listings, shipments, projects) are added
-- per-deployment as 0003_<domain>.sql following the exact same
-- conventions — see brain/README.md, "Domain extension".
--
-- Table + column NAMES are a contract: the cockpit and the
-- worker read these exact names. DO NOT rename anything here
-- without updating every consumer in the same change.
--
-- RESERVED SCOPING COLUMNS. Every table carries five nullable
-- columns reserved for multi-entity / multi-seat scoping:
--   company_id      uuid  — which company (multi-company groups)
--   entity_id       uuid  — which legal entity / venture
--   unit_id         uuid  — which operational unit (site, team,
--                           product line — whatever the domain
--                           tables scope on)
--   person_id       uuid  — which person/seat a row belongs to
--   lifecycle_stage text  — where the row sits in its lifecycle
-- All nullable today; single-company installs leave them null.
-- Future RLS policies will key on them — which is why they exist
-- from day one instead of arriving in a painful backfill later.
--
-- gen_random_uuid() comes from pgcrypto, which Supabase enables
-- by default. The line below is a safety net for plain Postgres.
-- ============================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- documents — the knowledge base (RAG store). body_text holds
-- inline content; storage_ref points at an external object
-- (bucket path, drive id) when the content is too large or
-- binary. At least one of the two should be present.
-- ------------------------------------------------------------
create table if not exists documents (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  doc_type        text,                       -- e.g. 'sop' | 'policy' | 'playbook' | 'reference'
  body_text       text,                       -- inline content (what agents retrieve over)
  storage_ref     text,                       -- pointer to external storage, if body lives elsewhere
  source          text,                       -- where this came from (connector name, 'manual', url)
  tags            jsonb not null default '[]'::jsonb
                  check (jsonb_typeof(tags) = 'array'),
  -- reserved scoping columns (see header)
  company_id      uuid,
  entity_id       uuid,
  unit_id         uuid,
  person_id       uuid,
  lifecycle_stage text,
  ingested_at     timestamptz not null default now()
);

-- ------------------------------------------------------------
-- approval_queue — proposed actions that the money / legal /
-- external-comms rules park for human sign-off. The worker
-- NEVER executes these kinds directly; it enqueues them here
-- and a human decides. See automations/worker/lib/writes.js
-- (ACTION_POLICY) for the kinds that route here.
-- ------------------------------------------------------------
create table if not exists approval_queue (
  id              uuid primary key default gen_random_uuid(),
  action_type     text not null,              -- e.g. 'invoice_send' | 'contract' | 'external_email'
  title           text not null,              -- one-line human-readable summary
  payload         jsonb not null default '{}'::jsonb,  -- everything needed to execute after approval
  proposed_by     text,                       -- who/what proposed it ('worker:reporting', 'seat:ops')
  status          text not null default 'pending'
                  check (status in ('pending','approved','rejected')),
  decided_by      text,
  decided_at      timestamptz,
  -- reserved scoping columns (see header)
  company_id      uuid,
  entity_id       uuid,
  unit_id         uuid,
  person_id       uuid,
  lifecycle_stage text,
  created_at      timestamptz not null default now()
);

-- ------------------------------------------------------------
-- audit_log — APPEND-ONLY. Every write through the worker lands
-- a row here. UPDATE and DELETE are blocked at the database by
-- the guard trigger below — the trail cannot be edited, only
-- extended. This is a safety property, not a convention.
-- ------------------------------------------------------------
create table if not exists audit_log (
  id              uuid primary key default gen_random_uuid(),
  actor           text not null,              -- who/what wrote ('worker:hub', 'connector:example-sheets', 'seat:owner')
  action          text not null,              -- what happened ('write.team_activity', 'approval.approved')
  entity          text,                       -- what it happened to ('team_activity', 'approval_queue:<id>')
  payload         jsonb,                      -- the row / decision detail, for forensics
  -- reserved scoping columns (see header)
  company_id      uuid,
  entity_id       uuid,
  unit_id         uuid,
  person_id       uuid,
  lifecycle_stage text,
  created_at      timestamptz not null default now()
);

-- Guard: audit_log is append-only. Any UPDATE or DELETE raises.
create or replace function audit_log_append_only()
returns trigger
language plpgsql
as $$
begin
  raise exception 'audit_log is append-only: % is not permitted', tg_op;
end;
$$;

drop trigger if exists audit_log_no_update on audit_log;
create trigger audit_log_no_update
  before update or delete on audit_log
  for each row execute function audit_log_append_only();

-- ------------------------------------------------------------
-- daily_brief — the generated morning brief. content_md is the
-- markdown body; metrics is a jsonb bag of the counts/figures
-- the brief was computed from (computed by code, never typed by
-- a model — the financial-accuracy rule applies here too).
-- ------------------------------------------------------------
create table if not exists daily_brief (
  id              uuid primary key default gen_random_uuid(),
  brief_date      date not null,
  content_md      text not null,
  metrics         jsonb not null default '{}'::jsonb,
  -- reserved scoping columns (see header)
  company_id      uuid,
  entity_id       uuid,
  unit_id         uuid,
  person_id       uuid,
  lifecycle_stage text,
  generated_at    timestamptz not null default now()
);

-- ------------------------------------------------------------
-- team_activity — what the team is doing / what's blocked.
-- person_ref is a plain label ('ops-manager', 'analyst-team'),
-- not a foreign key — keep people references light here; the
-- person_id scoping column is where a hard link lands later.
-- ------------------------------------------------------------
create table if not exists team_activity (
  id              uuid primary key default gen_random_uuid(),
  person_ref      text not null,              -- who ('ops-manager', 'system', a seat name)
  activity        text not null,              -- what they did / what's blocked
  entity          text,                       -- what it relates to (a doc id, an approval id, a connector)
  -- reserved scoping columns (see header)
  company_id      uuid,
  entity_id       uuid,
  unit_id         uuid,
  person_id       uuid,
  lifecycle_stage text,
  created_at      timestamptz not null default now()
);

-- ============================================================
-- Indexes — keep the cockpit's hot reads fast. Domain migrations
-- (0003+) should follow the same pattern for their own tables.
-- ============================================================
create index if not exists idx_documents_doc_type      on documents (doc_type);
create index if not exists idx_documents_ingested_at   on documents (ingested_at);
create index if not exists idx_documents_company_id    on documents (company_id);

create index if not exists idx_approval_status         on approval_queue (status);
create index if not exists idx_approval_created_at     on approval_queue (created_at);
create index if not exists idx_approval_company_id     on approval_queue (company_id);

create index if not exists idx_audit_created_at        on audit_log (created_at);
create index if not exists idx_audit_actor             on audit_log (actor);
create index if not exists idx_audit_company_id        on audit_log (company_id);

create index if not exists idx_daily_brief_date        on daily_brief (brief_date);
create index if not exists idx_daily_brief_company_id  on daily_brief (company_id);

create index if not exists idx_team_activity_created   on team_activity (created_at);
create index if not exists idx_team_activity_person    on team_activity (person_ref);
create index if not exists idx_team_activity_company   on team_activity (company_id);
