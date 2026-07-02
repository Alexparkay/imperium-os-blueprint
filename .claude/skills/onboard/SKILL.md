---
name: onboard
description: "Scaffold a NEW company's AI Operating System instance from this engine. Runs a short interview, then generates the context spine, empty memory pipeline, and a starter skill set. Use when the owner says 'onboard a company', 'set up the OS for [company]', 'scaffold a new instance', 'package the OS for a client', or when standing up the command centre for ANOTHER business. NOT for setting up this install for its own owner - that's start-onboarding."
metadata:
  title: OS Onboard - Scaffold a New Instance
  tags:
    - system
    - packaging
  type: skill
  status: active
  created: 2026-06-02
  updated: 2026-06-11
---

# OS Onboard - Scaffold a New Instance

Stands up a clean AI Operating System for a new company from the reusable engine. This is the sellable "first win".

## When to use

Setting up the command centre for a client, a new business unit, or a buyer of the OS.

**Distinct from `start-onboarding`:** that skill onboards THIS install for ITS owner (the "I've just installed this, let's start" flow). This skill is the utility the owner uses later to spin up a separate instance for ANOTHER company.

## The interview (7 questions - keep it tight)
1. **Company:** name, what it does in one line, who works here.
2. **ICP + offers:** who they sell to, what they sell.
3. **Positioning:** what they are, and what they are explicitly NOT.
4. **Connections:** which systems hold their data (CRM, email, calendar, docs, finance)?
5. **Capabilities:** the 3-5 daily/weekly tasks worth turning into skills first.
6. **Cadence:** which of those should run on-demand vs scheduled (local vs cloud)?
7. **Constraints:** anything the system must never do (compliance, tone, irreversible actions).

## What it generates
1. **Context spine** - `context/index.md`, `context/org/company.md`, `context/org/offers.md`, `context/org/glossary.md` filled from answers (the canonical pointer sheet).
2. **Memory pipeline** - empty `memory/raw/`, `memory/wiki/` with index stubs.
3. **Starter skills** - 3-5 skills built from Q5 via the skill-creator pattern (one real task each), not 20.
4. **Cadence** - note which skills are on-demand vs scheduled; wire `/schedule` only after the skill works manually.
5. **`Home.md`** - domain map for their business.

## Guardrails (carry from engine)
- Lean context: pointers not copies. Single source of truth.
- Human-in-loop on irreversible actions (no auto-send / auto-post / auto-invoice without approval).
- Start with 3-5 workflows, add on discovered gaps. No RAG/DB until a real retrieval problem exists.
- Never fabricate the company's numbers; ask or label `[UNVERIFIED]`.

## Then
Run `project-health` (Four Cs audit) to capture a Day-1 baseline score. Re-run weekly to show the score climb.

---

## Related

- [[project-health]]
- [[os-lint]]
