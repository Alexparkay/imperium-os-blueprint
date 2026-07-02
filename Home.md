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
| **Memory / knowledge** | `memory/` (see `memory/CONVENTIONS.md`), `context/` | memory-sync, memory-dream |
| **Tasks + dates** | `memory/kanban.md`, `memory/calendar.md` | (updated automatically after any task) |
| **Clients** | `clients/<name>/` (STATUS + context/legal/research/deliverables) | client-delivery, blueprint-archive |
| **Sales / strategy** | `memory/business/`, `context/offers.md` | company-strategy, mastermind-oracle |
| **Content** | `content-pipeline/` (drafts, published, templates, voice-profile) | content-pipeline, voice-check, content-cascade, video-score |
| **Research / intel** | `content-pipeline/research/`, `memory/content/creator-blueprints/` | deep-research, youtube-research, trend-intelligence, creator-oracle |
| **Finance** | `memory/finances.md` (script-computed, provenance required) | finance-audit |
| **People** | `memory/people.md`, `memory/people/dossiers/` | people work via memory-sync |
| **Notifications** | `automations/notify/` | notify after long tasks (see notify rule) |
| **YouTube ingestion** | `automations/youtube/` (Apify only, never scraping) | youtube-research, youtube-chapterize |
| **Live dashboard** | `dashboard/` (build on demand, see its README) | built with the owner once 2+ connectors are live |

## Conventions

- Folders are by **asset type**; this map is the **domain overlay**. Don't rename top-level folders once skills and rules reference them.
- Naming: kebab-case, date-first ISO (`YYYY-MM-DD-topic`). Full standard: `memory/CONVENTIONS.md`.
- Memory flow: raw capture (`memory/transcripts/`) → structured memory (`memory/*.md`) → outputs (`content-pipeline/`, `clients/*/deliverables/`).
- New information from {{OWNER_SHORT}} gets persisted to the right memory file in the same session it appears.

## Runtime

- **YouTube transcripts:** `node automations/youtube/transcripts.js "<url>"` (needs `APIFY_API_TOKEN` in root `.env`)
- **Notify:** `node automations/notify/notify.js "message" --summary "details"` (needs Telegram vars in root `.env`)
- Env vars all live in the root `.env` (never committed); see `.env.example` for the full list.
