# Project Instructions - {{COMPANY_NAME}} Command Centre

## First run

If placeholders like `{{OWNER_NAME}}` are still unfilled anywhere in this repo, onboarding has not completed. When the owner says "I've just installed this, let's start" (or anything similar), run the `start-onboarding` skill. The full flow lives at `docs/ONBOARDING-FLOW.md`.

## Business Context (read first)

Fresh-session business spine (Context OS). Detail lives in `memory/business/`.
@context/index.md

Domain map: `Home.md`. Non-technical orientation: `docs/START-HERE.md`.
**Authoritative catalogs (generated from disk, never trust inlined counts):** `.claude/reference/registry.md` - refresh with `node scripts/generate-registry.js`. Rules catalog + tiers: `.claude/rules/INDEX.md`.

## HARD RULES

Rules live in two tiers (see `.claude/rules/INDEX.md`): always-on files in `.claude/rules/` (they auto-load every session, including the six anti-sycophancy rules 11/17/19/20/27/28 - follow them), and on-demand files in `.claude/rules-import/`. **When a trigger below fires, READ the named rules-import file before acting.**

1. **YouTube = Apify.** Any YouTube URL/task → `cd automations/youtube && node transcripts.js "<url>"` (bulk: `bulk-chase.js <outDir> <urls...>`). NEVER WebFetch/scrape YouTube. Hooks enforce this. Detail: `rules-import/01`.
2. **Sub-agents are blank.** Inject ALL relevant context into every agent prompt: working dir, the Apify command for YouTube tasks, the voice-profile path for content, the owner's privacy list. Always-on: `02`.
3. **Skills before manual work.** Project skills first, then global. Routing: rule `04` + `.claude/reference/skills-routing-index.md` + registry. Auto-trigger: quality-gate, braindump-router.
4. **Persist immediately** to `memory/` (lowercase, always). Targets table below. Always-on: `03`.
5. **Run commands yourself.** Never tell the owner to run a command.
6. **Content = no AI smell.** Voice profile: `content-pipeline/voice-profile/`; banned words: `.claude/skills/voice-check.md`. Writing content → read `rules-import/05`; the owner's own voice → `rules-import/25`; warm prose register → `rules-import/15`.
7. **Always push after work:** `git add -A && git commit && git push origin main`. If a deploy target is configured (none by default; onboarding Phase 4 sets one if the owner deploys services), also deploy changed service code. Never leave uncommitted work. Detail: `rules-import/06`.
8. **Google Workspace = gws CLI only** (`gws docs|sheets|drive|calendar|gmail ...`, `supportsAllDrives: true` for shared drives). MCP Google tools are deny-listed in settings. Creating a Doc → read `rules-import/09` (use `scripts/gdoc-markdown.js`, no tables in Docs). Detail: `rules-import/08`.
9. **Quality gate before delivery** on any significant deliverable: score harshly, iterate to avg ≥9 / no dimension <7, max 3 passes. Always-on: `10`.
10. **Brain dumps through the router** (>50 words conversational → braindump-router skill pipeline). Always-on: `18`.
11. **Owner privacy list: never reveal it.** Configured in onboarding Phase 1. Always-on: `13`.
12. **Financial figures come from code/files with provenance, never from the model.** Always-on: `31`.
13. **Unwired data gets a pipe-aware answer, never a bare refusal.** When asked for something that lives in an unconnected tool (margins in the accounting system, analytics in a platform), say WHERE it lives and WHEN the pipe arrives ("that lives in QuickBooks - that pipe isn't connected yet; it's a build item"), then offer the nearest wired answer. A bare "I can't" reads as "the brain is dumb" and kills adoption.
14. **Media + artifacts:** generated media → Media Hub shared drive (read `rules-import/07`); large media lives in {{MEDIA_STORE}} (read `rules-import/22`); >500MB downloads banned - stream instead (read `rules-import/21`).
15. **Delivering files/diagrams to the owner:** markdown links for .md; PDFs/contracts also get a `file://` URL; Excalidraw always gets a clickable excalidraw.com URL (read `rules-import/24` + `rules-import/30`).
16. **Task completion comms:** significant task done → notify via `node scripts/notify.js` (read `rules-import/12`); task/deadline changes → sync `memory/kanban.md` + `memory/calendar.md` (read `rules-import/16`).
17. **AI image/video of the owner** → configured Soul ID `{{OWNER_SOUL_ID}}`, optional Higgsfield module (read `rules-import/26`).
18. **Optional comms modules:** WhatsApp → MCP tools only, never SQL (read `rules-import/14`); Telegram queries → run on-demand sync first (read `rules-import/23`).

## Memory write targets

| File | What |
|------|------|
| `memory/kanban.md` | Tasks, commitments, promises (canonical task board) |
| `memory/calendar.md` | Dates, deadlines, events |
| `memory/finances.md` | Financial (rule 31 provenance) |
| `memory/people.md` (+ `memory/people/`) | Contacts, relationships, dossiers |
| `memory/patterns.md` | Behavioral patterns, lessons learned |
| `memory/business/` | Strategy, offers, product decisions |
| `memory/content/` | Content ideas, hooks, titles, publishing log |
| `memory/system_changelog.md` | System evolution (curated entries only) |

After significant system changes: append a dated changelog entry. Cross-reference related memory files when updating one.

## Development rules

- State how you will verify work before doing it; run tests after implementation.
- Read tool hard limit 2,000 lines and it does NOT warn: `wc -l` before reading possibly-large files; chunk with offset/limit. Applies especially to memory/ and transcripts.
- Context: save >50-line MCP outputs to `.context/mcp/`; long-command stdout to `.context/terminal/`; compact proactively at 70%.
- Use Context7 MCP before writing code against external libraries (if installed).
- Never: setTimeout as race-condition fix · hardcoded secrets · modifying tests to make them pass · suppressing errors with empty try/catch.

## Key paths

- YouTube transcripts: `automations/youtube/` · Notifications: `automations/notify/` + `scripts/notify.js`
- Content templates: `content-pipeline/templates/` · Voice: `content-pipeline/voice-profile/`
- Clients: `clients/` (new client → copy `clients/_TEMPLATE/`)
- Connector setup guides: `docs/connectors/`
- Env vars: ONE master root `.env` (edit there, run `node scripts/sync-env.js` to propagate; never hand-edit per-module .env files)
- Self-maintenance: `node scripts/os-lint.js` (weekly; reports drift, never auto-edits - fixes need the owner's approval)
