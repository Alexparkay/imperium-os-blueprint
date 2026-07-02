-- SEED DATA — fictional, replace with the company's real data at activation
-- ============================================================
-- Company Brain — core seed
-- ============================================================
-- Every value below is OBVIOUSLY SYNTHETIC, drawn from the same
-- fictional universe used across this repo: Meridian Consulting,
-- the worked example in context/org/company.md (a made-up ops
-- consultancy run by "Dana Reyes"). Every text value is prefixed
-- SAMPLE or labelled FICTIONAL so seed rows are easy to find and
-- delete once real data flows.
--
-- THIS DIRECTORY IS THE SINGLE SOURCE OF SAMPLE DATA for the
-- whole operating layer — see seed/MANIFEST.md. The worker's
-- lib/fixtures.js mirrors these exact rows; any cockpit mock
-- must derive from them too. If you change a row here, change
-- the mirror in the same commit.
--
-- Core tables only: the seed covers documents, approval_queue,
-- audit_log, daily_brief, team_activity. Domain tables arrive
-- per-deployment (0003_<domain>.sql) and bring their own seed.
--
-- UUIDs are hard-coded (not gen_random_uuid()) so the fixture
-- mirror and any cross-references resolve deterministically.
-- Run AFTER 0001_core + 0002_rls. Idempotent-ish: re-running
-- conflicts on primary keys; run against a fresh DB or truncate
-- first (audit_log cannot be deleted row-wise — it is
-- append-only — so use TRUNCATE, which the trigger does not
-- intercept, or drop and re-migrate).
-- ============================================================

-- ------------------------------------------------------------
-- documents — 4 fictional knowledge-base entries
-- ------------------------------------------------------------
insert into documents (id, title, doc_type, body_text, storage_ref, source, tags) values
  ('11111111-0000-0000-0000-000000000001', 'SAMPLE — Engagement delivery SOP', 'sop',
   'FICTIONAL standard operating procedure for Meridian Consulting. Weeks 1-2: map the client''s order-to-cash process end to end. Weeks 3-6: run fix sprints against the top three leaks. Every Friday: a one-page client readout, decision-first. Nothing ships to the client without a second pair of eyes.',
   null, 'manual', '["sample","delivery","sop"]'::jsonb),
  ('11111111-0000-0000-0000-000000000002', 'SAMPLE — Services one-pager', 'reference',
   'FICTIONAL reference. Meridian Consulting runs 6-12 week diagnostic-and-fix engagements for mid-size logistics firms whose back-office operations leak money. Most engagements convert into a monthly retained ops-health relationship. We ship fixes, not slide decks.',
   null, 'manual', '["sample","positioning"]'::jsonb),
  ('11111111-0000-0000-0000-000000000003', 'SAMPLE — Client onboarding checklist', 'checklist',
   'FICTIONAL checklist. 1) Signed statement of work filed. 2) Data access agreed in writing. 3) Kick-off scheduled within 5 working days. 4) Client folder created with STATUS file. 5) First invoice queued for approval — never sent without sign-off.',
   null, 'manual', '["sample","onboarding","checklist"]'::jsonb),
  ('11111111-0000-0000-0000-000000000004', 'SAMPLE — Reporting style guide', 'playbook',
   'FICTIONAL playbook. Every brief and report is decision-first: lead with what needs attention, then the picture, then the numbers. Use only figures computed by code from source rows. If a number cannot be traced to a source, it does not get stated.',
   null, 'manual', '["sample","reporting","style"]'::jsonb);

-- ------------------------------------------------------------
-- approval_queue — 2 pending items (money + legal), showing the
-- park-for-sign-off pattern. payload carries everything needed
-- to execute AFTER a human approves.
-- ------------------------------------------------------------
insert into approval_queue (id, action_type, title, payload, proposed_by, status) values
  ('22222222-0000-0000-0000-000000000001', 'invoice_send',
   'SAMPLE — Send Q3 retainer invoice to Northgate Logistics (fictional client)',
   '{"client":"SAMPLE Northgate Logistics","amount":8500,"currency":"GBP","period":"2026-Q3","note":"fictional amount for demo purposes"}'::jsonb,
   'worker:reporting', 'pending'),
  ('22222222-0000-0000-0000-000000000002', 'contract',
   'SAMPLE — Approve renewal draft for Harbourline Freight (fictional client)',
   '{"client":"SAMPLE Harbourline Freight","document":"renewal-draft-v2","term_months":12,"note":"fictional contract for demo purposes"}'::jsonb,
   'seat:ops-manager', 'pending');

-- ------------------------------------------------------------
-- audit_log — 4 rows showing the shapes the worker writes.
-- Append-only: these can be truncated but never edited.
-- ------------------------------------------------------------
insert into audit_log (id, actor, action, entity, payload) values
  ('33333333-0000-0000-0000-000000000001', 'connector:example-sheets', 'upsert.team_activity', 'team_activity',
   '{"count":2,"note":"SAMPLE sync run (fictional)"}'::jsonb),
  ('33333333-0000-0000-0000-000000000002', 'worker:hub', 'approval.enqueued', 'approval_queue:invoice_send',
   '{"title":"SAMPLE — Send Q3 retainer invoice to Northgate Logistics (fictional client)"}'::jsonb),
  ('33333333-0000-0000-0000-000000000003', 'cron:daily-brief', 'write.daily_brief', 'daily_brief',
   '{"brief_date":"2026-07-01","note":"SAMPLE brief generated (fictional)"}'::jsonb),
  ('33333333-0000-0000-0000-000000000004', 'seat:owner', 'approval.rejected', 'approval_queue:33330000-sample',
   '{"reason":"SAMPLE — fictional earlier item rejected during demo"}'::jsonb);

-- ------------------------------------------------------------
-- daily_brief — 1 generated brief. metrics holds the counts the
-- brief was computed from (computed by code, never by a model).
-- ------------------------------------------------------------
insert into daily_brief (id, brief_date, content_md, metrics) values
  ('44444444-0000-0000-0000-000000000001', '2026-07-01',
   E'# SAMPLE Daily Brief — Meridian Consulting — 2026-07-01\n\n_Fictional sample brief. Replace when live data is wired._\n\n## What needs attention today\n- 2 items waiting in the approval queue (1 invoice, 1 contract renewal).\n- Northgate engagement readout due Friday — draft not started.\n\n## The picture\n- 4 knowledge documents live in the Brain.\n- Team activity healthy across delivery and ops this week.\n\n> All figures above are SAMPLE data from the fictional Meridian universe.',
   '{"pending_approvals":2,"documents":4,"team_activity_rows":6,"note":"SAMPLE metrics, computed from the seed rows"}'::jsonb);

-- ------------------------------------------------------------
-- team_activity — 6 rows across the fictional Meridian team
-- ------------------------------------------------------------
insert into team_activity (id, person_ref, activity, entity) values
  ('55555555-0000-0000-0000-000000000001', 'principal',    'SAMPLE — Reviewed Northgate diagnostic findings, flagged two process leaks', 'documents:11111111-0000-0000-0000-000000000001'),
  ('55555555-0000-0000-0000-000000000002', 'ops-manager',  'SAMPLE — Drafted Harbourline renewal, queued for approval',                 'approval_queue:22222222-0000-0000-0000-000000000002'),
  ('55555555-0000-0000-0000-000000000003', 'analyst-team', 'SAMPLE — Mapped week-2 order-to-cash flow for the current engagement',      null),
  ('55555555-0000-0000-0000-000000000004', 'system',       'SAMPLE — Daily brief generated',                                            'daily_brief:44444444-0000-0000-0000-000000000001'),
  ('55555555-0000-0000-0000-000000000005', 'ops-manager',  'SAMPLE — Blocked: waiting on client data access for the fix sprint',       null),
  ('55555555-0000-0000-0000-000000000006', 'system',       'SAMPLE — Example-sheets connector ran in fixture mode',                     'connector:example-sheets');
