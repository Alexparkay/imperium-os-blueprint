---
title: Org Context Sync (Multi-Seat)
product: Imperium OS
type: connector-guide
status: optional
created: 2026-07-02
---

# Org context sync (multi-seat companies)

This connector is for companies running **more than one seat**: the owner bought the system, and each head of department gets their own install. Every seat needs the same company truth - what the company is, what it sells, who leads what, who approves what - and that truth must not drift between seats. Org sync solves that with one small shared repository, the **org context repo**, that every seat mirrors.

Single-seat install? Skip this entirely. Your `context/org/` folder is filled during onboarding and edited normally. This page only matters the day a second seat arrives.

**Time:** about 15 minutes for the install team, near zero for each seat after that.
**Set up by:** the install team (or a technically comfortable org admin), not the day-to-day owner - this is the one connector that isn't part of the standard guided setup.

## What it is

- The **org context repo** is a private GitHub repository, one per company, named something like `<company>-org-context`. It contains the files that live in each seat's `context/org/` folder: `company.md`, `offers.md`, `glossary.md`, `departments.md`, `people-roster.md`.
- Each seat **pulls it read-only**. A small script (`scripts/org-sync.js`) refreshes the seat's `context/org/` folder from the repo, automatically at the start of every session.
- Seats **propose changes upward** instead of editing. A seat that spots wrong or missing company truth writes a proposal file; the org admin merges it into the org repo; every seat gets the change on its next sync. One source of truth, no drift.

## How the install team creates it (first seat)

1. Take the company's already-onboarded install (the owner's seat is usually first). Its `context/org/` files are the starting truth.
2. Create a **private** GitHub repository under the company's account: `<company>-org-context`. Private matters - this file set names people and offers.
3. Copy the seat's `context/org/` files into it and push. That's the whole repo: five markdown files, no code.
4. Decide who the **org admin** is (usually the owner or their ops lead): the one person who merges proposals into this repo.
5. On the seat, add one line to the root `.env`:
   ```
   ORG_CONTEXT_REPO=git@github.com:<company>/<company>-org-context.git
   ```
   (HTTPS URLs work too if that's how the machine authenticates to GitHub.)
6. Verify: run `node scripts/org-sync.js`. It should report the number of files synced. Then `node scripts/org-sync.js --status` shows the repo and the last sync time.

From then on, the SessionStart hook runs the sync automatically. If the network is down, the session starts anyway with a note that org context may be stale.

## How a second seat joins

1. Install the OS for the new seat the normal way (clone, "I've just installed this, let's start"). Run their onboarding for identity, voice, and THEIR seat file (`context/seat.md`) - but the company interview is already answered company-wide.
2. Give the seat's GitHub account read access to `<company>-org-context`.
3. Add the same `ORG_CONTEXT_REPO=` line to the new seat's `.env` and run `node scripts/org-sync.js`. Their `context/org/` templates are replaced by the company's real org truth in one pull.
4. Fill in their `context/seat.md`: who sits there, the real daily operator, what they approve vs escalate, their KPIs.

## The rules once org mode is on

- **`context/org/` is read-only on every seat.** The sync has a guard: if local files were hand-edited, it warns and refuses to overwrite them rather than silently clobbering (or losing) the edit.
- **Changes propose upward.** A seat writes `memory/org-proposals/YYYY-MM-DD-<slug>.md` with a diff-style block (format in `memory/org-proposals/README.md`), and the org admin merges it into the org repo. `node scripts/org-sync.js --propose <file>` checks a proposal is well-formed.
- **The seat's own truth stays local.** `context/seat.md`, `memory/`, clients, drafts - none of that syncs anywhere. Only the five org files are shared.

## Honest v1 limits

- **No shared task board.** Each seat's kanban is its own. Cross-seat work coordination still happens in the company's normal tools.
- **No cross-seat memory visibility.** Seat A cannot see what seat B knows. Only org truth is shared - by design (a department head's client notes and finances are their seat's business), but it means "ask every seat" queries don't exist yet.
- **Proposals travel by ordinary means.** The `--propose` command validates the file and restates the flow; it does not open a pull request or message the admin. The admin has to be told a proposal exists.
- **One org repo, whole-file truth.** There's no per-section permissioning; a seat that can read the org repo reads all five files.

## What can go wrong

- **`org-sync: ABORT - local modifications detected`.** Someone edited `context/org/` by hand. Save the intended change as a proposal (see `memory/org-proposals/README.md`), restore the folder with `git checkout -- context/org/`, re-run the sync.
- **Clone or fetch fails (auth).** The machine isn't signed into GitHub with access to the org repo. Fix the GitHub sign-in (same as the github-backup connector), confirm the account has read access to `<company>-org-context`, re-run.
- **`the org repo cloned empty`.** The repo exists but has no files pushed yet. Push the five org files first; the sync refuses to wipe a seat's context over an empty remote.
- **A seat keeps stale truth.** Run `node scripts/org-sync.js --status` on that seat: if the last sync is old, the SessionStart hook may be failing silently - run `node scripts/org-sync.js` by hand and read the error.
