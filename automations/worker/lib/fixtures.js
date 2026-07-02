// ============================================================
// In-memory fixtures for FIXTURE MODE.
// ------------------------------------------------------------
// MIRROR OF brain/seed/seed.sql — same UUIDs, same values, same
// fictional Meridian universe. This file is a CONSUMER of the
// single-seed-source convention (brain/seed/MANIFEST.md): it
// never invents data. If a row changes in seed.sql, change it
// here in the same commit.
//
// These rows are what the worker serves when no SUPABASE_URL is
// configured, so every surface renders a full picture with zero
// credentials. They are NOT the source of truth — the Brain is.
// Every value is obviously synthetic (SAMPLE / FICTIONAL).
// ============================================================

function loadFixtures() {
  return {
    documents: [
      {
        id: '11111111-0000-0000-0000-000000000001',
        title: 'SAMPLE — Engagement delivery SOP',
        doc_type: 'sop',
        body_text: "FICTIONAL standard operating procedure for Meridian Consulting. Weeks 1-2: map the client's order-to-cash process end to end. Weeks 3-6: run fix sprints against the top three leaks. Every Friday: a one-page client readout, decision-first. Nothing ships to the client without a second pair of eyes.",
        storage_ref: null, source: 'manual', tags: ['sample', 'delivery', 'sop'],
        ingested_at: '2026-07-01T08:00:00Z',
      },
      {
        id: '11111111-0000-0000-0000-000000000002',
        title: 'SAMPLE — Services one-pager',
        doc_type: 'reference',
        body_text: 'FICTIONAL reference. Meridian Consulting runs 6-12 week diagnostic-and-fix engagements for mid-size logistics firms whose back-office operations leak money. Most engagements convert into a monthly retained ops-health relationship. We ship fixes, not slide decks.',
        storage_ref: null, source: 'manual', tags: ['sample', 'positioning'],
        ingested_at: '2026-07-01T08:00:00Z',
      },
      {
        id: '11111111-0000-0000-0000-000000000003',
        title: 'SAMPLE — Client onboarding checklist',
        doc_type: 'checklist',
        body_text: 'FICTIONAL checklist. 1) Signed statement of work filed. 2) Data access agreed in writing. 3) Kick-off scheduled within 5 working days. 4) Client folder created with STATUS file. 5) First invoice queued for approval — never sent without sign-off.',
        storage_ref: null, source: 'manual', tags: ['sample', 'onboarding', 'checklist'],
        ingested_at: '2026-07-01T08:00:00Z',
      },
      {
        id: '11111111-0000-0000-0000-000000000004',
        title: 'SAMPLE — Reporting style guide',
        doc_type: 'playbook',
        body_text: 'FICTIONAL playbook. Every brief and report is decision-first: lead with what needs attention, then the picture, then the numbers. Use only figures computed by code from source rows. If a number cannot be traced to a source, it does not get stated.',
        storage_ref: null, source: 'manual', tags: ['sample', 'reporting', 'style'],
        ingested_at: '2026-07-01T08:00:00Z',
      },
    ],

    approval_queue: [
      {
        id: '22222222-0000-0000-0000-000000000001',
        action_type: 'invoice_send',
        title: 'SAMPLE — Send Q3 retainer invoice to Northgate Logistics (fictional client)',
        payload: { client: 'SAMPLE Northgate Logistics', amount: 8500, currency: 'GBP', period: '2026-Q3', note: 'fictional amount for demo purposes' },
        proposed_by: 'worker:reporting', status: 'pending',
        decided_by: null, decided_at: null, created_at: '2026-07-01T07:05:00Z',
      },
      {
        id: '22222222-0000-0000-0000-000000000002',
        action_type: 'contract',
        title: 'SAMPLE — Approve renewal draft for Harbourline Freight (fictional client)',
        payload: { client: 'SAMPLE Harbourline Freight', document: 'renewal-draft-v2', term_months: 12, note: 'fictional contract for demo purposes' },
        proposed_by: 'seat:ops-manager', status: 'pending',
        decided_by: null, decided_at: null, created_at: '2026-07-01T07:10:00Z',
      },
    ],

    audit_log: [
      {
        id: '33333333-0000-0000-0000-000000000001',
        actor: 'connector:example-sheets', action: 'upsert.team_activity', entity: 'team_activity',
        payload: { count: 2, note: 'SAMPLE sync run (fictional)' }, created_at: '2026-07-01T06:55:00Z',
      },
      {
        id: '33333333-0000-0000-0000-000000000002',
        actor: 'worker:hub', action: 'approval.enqueued', entity: 'approval_queue:invoice_send',
        payload: { title: 'SAMPLE — Send Q3 retainer invoice to Northgate Logistics (fictional client)' }, created_at: '2026-07-01T07:05:00Z',
      },
      {
        id: '33333333-0000-0000-0000-000000000003',
        actor: 'cron:daily-brief', action: 'write.daily_brief', entity: 'daily_brief',
        payload: { brief_date: '2026-07-01', note: 'SAMPLE brief generated (fictional)' }, created_at: '2026-07-01T07:00:00Z',
      },
      {
        id: '33333333-0000-0000-0000-000000000004',
        actor: 'seat:owner', action: 'approval.rejected', entity: 'approval_queue:33330000-sample',
        payload: { reason: 'SAMPLE — fictional earlier item rejected during demo' }, created_at: '2026-06-30T16:00:00Z',
      },
    ],

    daily_brief: [
      {
        id: '44444444-0000-0000-0000-000000000001',
        brief_date: '2026-07-01',
        content_md:
          '# SAMPLE Daily Brief — Meridian Consulting — 2026-07-01\n\n' +
          '_Fictional sample brief. Replace when live data is wired._\n\n' +
          '## What needs attention today\n' +
          '- 2 items waiting in the approval queue (1 invoice, 1 contract renewal).\n' +
          '- Northgate engagement readout due Friday — draft not started.\n\n' +
          '## The picture\n' +
          '- 4 knowledge documents live in the Brain.\n' +
          '- Team activity healthy across delivery and ops this week.\n\n' +
          '> All figures above are SAMPLE data from the fictional Meridian universe.',
        metrics: { pending_approvals: 2, documents: 4, team_activity_rows: 6, note: 'SAMPLE metrics, computed from the seed rows' },
        generated_at: '2026-07-01T07:00:00Z',
      },
    ],

    team_activity: [
      { id: '55555555-0000-0000-0000-000000000001', person_ref: 'principal',    activity: 'SAMPLE — Reviewed Northgate diagnostic findings, flagged two process leaks', entity: 'documents:11111111-0000-0000-0000-000000000001', created_at: '2026-07-01T09:00:00Z' },
      { id: '55555555-0000-0000-0000-000000000002', person_ref: 'ops-manager',  activity: 'SAMPLE — Drafted Harbourline renewal, queued for approval',                 entity: 'approval_queue:22222222-0000-0000-0000-000000000002', created_at: '2026-07-01T08:40:00Z' },
      { id: '55555555-0000-0000-0000-000000000003', person_ref: 'analyst-team', activity: 'SAMPLE — Mapped week-2 order-to-cash flow for the current engagement',      entity: null, created_at: '2026-07-01T08:20:00Z' },
      { id: '55555555-0000-0000-0000-000000000004', person_ref: 'system',       activity: 'SAMPLE — Daily brief generated',                                            entity: 'daily_brief:44444444-0000-0000-0000-000000000001', created_at: '2026-07-01T07:00:00Z' },
      { id: '55555555-0000-0000-0000-000000000005', person_ref: 'ops-manager',  activity: 'SAMPLE — Blocked: waiting on client data access for the fix sprint',        entity: null, created_at: '2026-06-30T15:30:00Z' },
      { id: '55555555-0000-0000-0000-000000000006', person_ref: 'system',       activity: 'SAMPLE — Example-sheets connector ran in fixture mode',                     entity: 'connector:example-sheets', created_at: '2026-06-30T15:00:00Z' },
    ],
  };
}

module.exports = { loadFixtures };
