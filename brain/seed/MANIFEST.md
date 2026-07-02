# Seed manifest — the single source of sample data

This directory is the ONLY place fixture/sample data for the operating layer lives. One dataset, one fictional universe (Meridian Consulting, the worked example from `context/org/company.md`), mirrored everywhere it is needed. Sample data invented anywhere else is the failure mode this file exists to prevent: two datasets drift, a demo shows numbers no seed explains, and someone eventually mistakes an orphan mock row for truth.

## The convention

1. **`seed.sql` is canonical.** Every sample row for the core Brain tables is defined here, with hard-coded UUIDs and every text value prefixed `SAMPLE` or labelled FICTIONAL.
2. **Consumers mirror, never invent.** Anything that needs sample data copies rows from `seed.sql`, keeping the same ids and values.
3. **Change here first.** Any edit to sample data starts in `seed.sql`, then propagates to every consumer in the same commit.
4. **New sample data traces here.** If you add fixture data anywhere in the repo (a new connector's mock output, a cockpit mock, a test), it must either mirror rows in this directory or be added to this directory first, and this consumer list must be updated.

## Consumers (keep this list current)

| Consumer | What it mirrors | Rule |
|---|---|---|
| `automations/worker/lib/fixtures.js` | Every row in `seed.sql`, same UUIDs and values | Byte-for-byte value parity; edit in the same commit as `seed.sql` |
| Any cockpit mock mode (see `dashboard/README.md`) | The same rows, via the worker's fixtures or a direct mirror | Mock surfaces must render the "SEED DATA" badge |
| Domain seeds (`0003_<domain>.sql`, per-deployment) | Nothing yet — they bring their own sample rows | Same conventions: `SAMPLE` prefix, hard-coded UUIDs, listed here when added |

## Why hard-coded UUIDs

Cross-references between sample rows (an activity row pointing at an approval item) must resolve identically in the database seed and in the in-memory fixtures. Deterministic ids make the mirror checkable: grep a UUID and every copy of that row shows up.
