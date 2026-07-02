-- ============================================================
-- Company Brain — Row Level Security (RLS)
-- Migration 0002 — enable + FORCE RLS, default-deny everywhere
-- ============================================================
--
-- SECURITY MODEL (read before editing)
-- ------------------------------------------------------------
-- Every table below has RLS enabled AND forced, with NO
-- permissive policy. That makes each table default-deny: any
-- client connecting with the `anon` role or an authenticated
-- user role sees and can write NOTHING. This is intentional.
--
-- The cockpit and the worker access the Brain SERVER-SIDE using
-- the Supabase SERVICE_ROLE key. service_role bypasses RLS
-- entirely, so both work against a fully locked-down database
-- with zero public policies. The service_role key NEVER ships
-- to a browser — it lives in server environments only.
--
-- Per-seat / per-entity read policies are a FUTURE addition.
-- The schema already carries the columns those policies will
-- scope on (company_id, entity_id, unit_id, person_id,
-- lifecycle_stage on every table). When that lands, add SELECT
-- policies keyed to auth.uid() against a membership table.
-- DO NOT loosen the default-deny posture below with a blanket
-- `using (true)` — that would open the Brain to any anonymous
-- client that finds the project URL.
--
-- `force row level security` is included so that even the table
-- OWNER role is subject to RLS — only service_role (which
-- bypasses RLS by design) gets through. This closes the gap
-- where a misconfigured connection using the owner role could
-- otherwise read everything.
--
-- Domain migrations (0003_<domain>.sql) MUST repeat this block
-- for every table they add. A domain table without forced RLS
-- is a hole in the whole model.
-- ============================================================

-- Enable + force RLS on every core table. No policies = default-deny.
alter table documents       enable row level security;
alter table documents       force  row level security;

alter table approval_queue  enable row level security;
alter table approval_queue  force  row level security;

alter table audit_log       enable row level security;
alter table audit_log       force  row level security;

alter table daily_brief     enable row level security;
alter table daily_brief     force  row level security;

alter table team_activity   enable row level security;
alter table team_activity   force  row level security;

-- NO POLICIES ARE DEFINED ON PURPOSE.
-- Default-deny is the desired state. Server-side consumers use
-- service_role (bypasses RLS). Do not add `using (true)`
-- policies — that would expose the Brain to any anon client.
