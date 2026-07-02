---
title: Company Brain (database)
product: Imperium OS
type: connector-guide
status: dormant-module
created: 2026-07-02
---

# The Company Brain — activation guide

The Brain is a database for the company's structured operational data: knowledge documents, the approval queue, the tamper-proof audit trail, the daily brief, team activity — and, once activated, whatever your company actually operates on (orders, projects, shipments, listings). Every dashboard and every automated report becomes a filter over this one database.

It ships in this OS **dormant**: the full schema lives in `brain/`, ready to apply, but nothing requires it. The OS runs perfectly well on files alone. You activate the Brain **with your build team** when you want live operational data — typically when a cockpit dashboard or real data pipes are on the table.

**Time:** the schema applies in minutes; deciding your domain tables with the build team is the real work (a working session or two).
**Cost:** your own Supabase project. The free tier covers the core comfortably; a production deployment with real volume lands on Supabase's paid tier (their pricing, your bill, no markup through us).

## What you do vs what the build team does

You create one account and share two keys. The build team designs your domain tables (the main design decision of the engagement), applies the migrations, and wires the worker to it.

## Keys you'll need to provide

| Key | Where it comes from |
|---|---|
| `SUPABASE_URL` | Your own Supabase project → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page. This key is powerful: server-side only, never in a browser, never in a chat message — it goes straight into `.env` |

That's the whole list for the Brain. It is YOUR Supabase project: your account, your data, your bill. If the engagement ever ends, the database and everything in it stays yours.

## What activation looks like

1. **You create a Supabase project** (supabase.com, a few clicks) and put the two keys in the root `.env`.
2. **The build team applies the core** — `brain/migrations/0001_core.sql` then `0002_rls.sql` (commands in `brain/README.md`). The database is now locked down by default: every table default-deny, audit log append-only.
3. **Together you design the domain tables** — what does this company operate on? Those become `0003_<domain>.sql`, following the same conventions (scoping columns, forced RLS, audited writes).
4. **Optionally, the seed** — clearly-fictional sample data so every surface renders before real pipes flow. Deleted once real data arrives.

## The safety model (why this is safe to leave dormant AND to activate)

- **Default-deny everywhere.** Row Level Security is enabled and forced on every table with zero public policies. An anonymous client sees nothing, ever.
- **Append-only audit.** Every write lands an audit row; the database itself blocks editing or deleting the trail.
- **Approval queue.** Actions touching money, legal, or external comms park for a human decision before anything executes.

## What can go wrong

- **"Can I skip Supabase and use something else?"** The contract is Postgres; Supabase is the packaging (hosting, keys, dashboard). Plain Postgres works with the same files — raise it with the build team.
- **Someone asks for the service_role key in chat.** Don't paste it into anything except your own `.env`. The system is designed never to echo it.
- **You want this now, without the build team.** The schema is complete and documented — a technical person can apply it today. The value of the engagement is the domain-table design and the pipes, not the button-pressing.
