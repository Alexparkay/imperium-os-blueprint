---
title: Seed Data Convention
product: Imperium OS
type: convention
audience: maintainers and build teams
created: 2026-07-02
---

# Seed Data Convention

One rule, enforced two ways: **every piece of sample data in this repo traces back to `brain/seed/`**, and **every surface rendering non-live data says so, visibly**.

## Why this exists

The failure mode is silent mock data. A dashboard fills with plausible numbers, a demo goes well, and six weeks later someone makes a decision from a screen nobody remembers is fake. Its sibling failure is dataset drift: two independently-invented sample sets that agree at first and quietly diverge, so a demo shows rows no seed explains. Both happened in real deliveries. Both are prevented structurally, not by memory.

## The single-source rule

- `brain/seed/seed.sql` is the canonical sample dataset: hard-coded UUIDs, every value prefixed `SAMPLE` or labelled FICTIONAL, one fictional universe.
- Consumers **mirror, never invent**. The worker's `automations/worker/lib/fixtures.js` carries the same rows with the same UUIDs; any cockpit mock derives from the same rows.
- Every consumer is listed in `brain/seed/MANIFEST.md`. New fixture data anywhere in the repo either mirrors the seed or is added to the seed first, and joins the manifest in the same commit.
- Deterministic UUIDs make the mirror checkable: grep one id and every copy of that row shows up.

## The badge rule

- Any surface (dashboard, report, page) rendering non-live data shows a visible **SEED DATA** badge on the surface itself. Not a console log, not a footnote. The full cockpit contract lives in `dashboard/README.md`.
- At the API level, the worker's `"source": "fixtures"` field is the same badge: every response says which backend produced it, so a client of the API can never mistake fixture rows for live rows. `automations/worker/hub.js` stamps it on every payload.

## Enforcement

| Layer | Tool | Severity |
|---|---|---|
| Day-to-day | `node scripts/os-lint.js` (check 7d) | WARN - advisory drift alarm |
| Pre-release / pre-delivery | `node scripts/package-check.js` (checks 4 + 5) | FAIL - blocks the package |

Both compare the UUID sets of `seed.sql` and the worker fixtures (shared helper: `scripts/lib/seed-utils.js`), and package-check additionally verifies the manifest is complete and the badge contract is intact.

## See also

- `brain/seed/MANIFEST.md` - the consumer list and the change-here-first workflow
- `dashboard/README.md` - the cockpit contract (badge requirement, fall-back rules)
- `docs/connectors/worker.md` - activating the worker beyond fixture mode
