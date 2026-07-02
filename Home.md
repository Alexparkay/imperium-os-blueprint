---
title: Home, the command centre map
type: index
status: template
---

# Home: {{COMPANY_NAME}} Command Centre

Domain map of the whole system. An org-chart view over the folders: nothing here moves files, it tells you (and any fresh session) where each business function lives.

## Start here

- **Business context (read first):** [context/index.md](context/index.md)
- **Config + rules:** `.claude/CLAUDE.md`, `.claude/rules/INDEX.md`
- **How the OS works:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **New install?** [docs/START-HERE.md](docs/START-HERE.md), then say "I've just installed this, let's start"
- **Health + audit:** run the `project-health` skill

## Domains → where they live

| Domain | Lives in | Key skills |
|---|---|---|
| **Memory / knowledge** | `memory/` (see `memory/CONVENTIONS.md`), `context/` (org truth: `context/org/` · seat truth: `context/seat.md`) | memory-sync, memory-dream |
| **Tasks + dates** | `memory/kanban.md`, `memory/calendar.md` | (updated automatically after any task) |
| **Clients** | `clients/<name>/` (STATUS + context/legal/research/deliverables) | client-delivery, blueprint-archive |
| **Sales / strategy** | `memory/business/`, `context/org/offers.md` | company-strategy, mastermind-oracle |
| **Content** | `content-pipeline/` (drafts, published, templates, voice-profile) | voice-check (base) · content-pipeline, content-cascade, video-score (content-marketing pack) |
| **Research / intel** | `content-pipeline/research/`, `memory/content/creator-blueprints/` | deep-research, youtube-research (base) · trend-intelligence, creator-oracle (content-marketing pack) |
| **Finance** | `memory/finances.md`, `memory/finance/` (script-computed, provenance required) | finance-audit, approval-thresholds (finance pack) |
| **Operations** | `memory/kanban.md`, `memory/business/sops/`, `memory/vendors.md` | meeting-notes-to-actions, sop-writer, vendor-tracker, process-health (ops pack) |
| **Sales / outreach** | `memory/pipeline.md`, `memory/people/` | cold-email-writer, prospect-intel (sales-crm pack) |
| **People** | `memory/people.md`, `memory/people/dossiers/` | people work via memory-sync |
| **Notifications** | `automations/notify/` | notify after long tasks (see notify rule) |
| **YouTube ingestion** | `automations/youtube/` (Apify only, never scraping) | youtube-research (base) · youtube-chapterize (content-marketing pack) |
| **Live dashboard** | `dashboard/` (build on demand, see its README) | built with the owner once 2+ connectors are live |

## Base vs department packs

The base carries the ~21 engine skills every seat needs (memory, routing, quality, research, delivery). Department capabilities ship as optional packs in `packs/` - content-marketing, finance, ops, sales-crm - installed per seat with `node scripts/install-pack.js <pack>`. Skills marked "(pack)" above exist only after their pack is installed; install state lives in `packs/installed.json`, the full spec in `packs/README.md`.

## Conventions

- Folders are by **asset type**; this map is the **domain overlay**. Don't rename top-level folders once skills and rules reference them.
- Org truth (`context/org/`, company-wide) vs seat truth (`context/seat.md`, this install only). Multi-seat companies sync the org folder read-only from a shared repo: `context/org/README.md`.
- Naming: kebab-case, date-first ISO (`YYYY-MM-DD-topic`). Full standard: `memory/CONVENTIONS.md`.
- Memory flow: raw capture (`memory/transcripts/`) → structured memory (`memory/*.md`) → outputs (`content-pipeline/`, `clients/*/deliverables/`).
- New information from {{OWNER_SHORT}} gets persisted to the right memory file in the same session it appears.

## Runtime

- **YouTube transcripts:** `node automations/youtube/transcripts.js "<url>"` (needs `APIFY_API_TOKEN` in root `.env`)
- **Notify:** `node automations/notify/notify.js "message" --summary "details"` (needs Telegram vars in root `.env`)
- Env vars all live in the root `.env` (never committed); see `.env.example` for the full list.
