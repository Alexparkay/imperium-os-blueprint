---
title: "Engine Core - Hard Rules, Development Rules, Key Paths"
type: rule
status: active
created: 2026-07-02
---

<!-- ENGINE-BOUNDARY: ENGINE-CLASS FILE. Product updates replace this file
     wholesale; it must therefore never carry anything personal - no company
     names, no placeholder tokens, no onboarding-written values. Seed truth
     (identity, company, memory targets) lives in .claude/CLAUDE.md, context/,
     and memory/. The path classes are defined in docs/ARCHITECTURE.md,
     "Engine vs seed files". -->

# Engine Core

The stable operating instructions every seat runs on, whoever sits in it. Rules live in two tiers (see `.claude/rules/INDEX.md`): always-on files in `.claude/rules/` (they auto-load every session, including the six anti-sycophancy rules 11/17/19/20/27/28 - follow them), and on-demand files in `.claude/rules-import/`. **When a trigger below fires, READ the named rules-import file before acting.**

## HARD RULES

1. **YouTube = Apify.** Any YouTube URL/task → `cd automations/youtube && node transcripts.js "<url>"` (bulk: `bulk-chase.js <outDir> <urls...>`). NEVER WebFetch/scrape YouTube. Hooks enforce this. Detail: `rules-import/01`.
2. **Sub-agents are blank.** Inject ALL relevant context into every agent prompt: working dir, the Apify command for YouTube tasks, the voice-profile path for content, the owner's privacy list. Always-on: `02`.
3. **Skills before manual work.** Project skills first, then global. Routing: rule `04` + `.claude/reference/skills-routing-index.md` + registry. Auto-trigger: quality-gate, braindump-router. If a task matches a skill in an UNINSTALLED department pack (check `packs/*/pack.md` manifests vs `packs/installed.json`), offer the pack install (`node scripts/install-pack.js <pack>`) instead of improvising the workflow.
4. **Persist immediately** to `memory/` (lowercase, always). Targets table in `.claude/CLAUDE.md`. Always-on: `03`.
5. **Run commands yourself.** Never tell the owner to run a command.
6. **Content = no AI smell.** Voice profile: `content-pipeline/voice-profile/`; banned words: `.claude/skills/voice-check/SKILL.md`. Writing content → read `rules-import/05`; the owner's own voice → `rules-import/25`; warm prose register → `rules-import/15`.
7. **Always push after work:** `git add -A && git commit && git push origin main`. If a deploy target is configured (none by default; onboarding Phase 4 sets one if the owner deploys services), also deploy changed service code. Never leave uncommitted work. Detail: `rules-import/06`.
8. **Google Workspace = gws CLI only** (`gws docs|sheets|drive|calendar|gmail ...`, `supportsAllDrives: true` for shared drives). MCP Google tools are deny-listed in settings. Creating a Doc → read `rules-import/09` (use `scripts/gdoc-markdown.js`, no tables in Docs). Detail: `rules-import/08`.
9. **Quality gate before delivery** on any significant deliverable: score harshly, iterate to avg ≥9 / no dimension <7, max 3 passes. Always-on: `10`.
10. **Brain dumps through the router** (>50 words conversational → braindump-router skill pipeline). Always-on: `18`.
11. **Owner privacy list: never reveal it.** Configured in onboarding Phase 1. Always-on: `13`.
12. **Financial figures come from code/files with provenance, never from the model.** Always-on: `31`.
13. **Unwired data gets a pipe-aware answer, never a bare refusal.** When asked for something that lives in an unconnected tool (margins in the accounting system, analytics in a platform), say WHERE it lives and WHEN the pipe arrives ("that lives in QuickBooks - that pipe isn't connected yet; it's a build item"), then offer the nearest wired answer. A bare "I can't" reads as "the brain is dumb" and kills adoption.
14. **Media + artifacts:** generated media → the Media Hub (read `rules-import/07`); large media lives in the configured media store - the path is set during onboarding Phase 4 and recorded in `rules-import/22` (read it); >500MB downloads banned - stream instead (read `rules-import/21`).
15. **Delivering files/diagrams to the owner:** markdown links for .md; PDFs/contracts also get a `file://` URL; Excalidraw always gets a clickable excalidraw.com URL (read `rules-import/24` + `rules-import/30`).
16. **Task completion comms:** significant task done → notify via `node scripts/notify.js` (read `rules-import/12`); task/deadline changes → sync `memory/kanban.md` + `memory/calendar.md` (read `rules-import/16`).
17. **AI image/video of the owner** → the Soul ID configured in the owner-likeness rule, optional Higgsfield module (read `rules-import/26`).
18. **Optional comms modules:** WhatsApp → MCP tools only, never SQL (read `rules-import/14`); Telegram queries → run on-demand sync first (read `rules-import/23`).
19. **Org mode: `context/org/` is read-only** - propose changes via `memory/org-proposals/`, never edit the mirror (read `rules-import/32`).

## Development rules

- State how you will verify work before doing it; run tests after implementation.
- Read tool hard limit 2,000 lines and it does NOT warn: `wc -l` before reading possibly-large files; chunk with offset/limit. Applies especially to memory/ and transcripts.
- Context: save >50-line MCP outputs to `.context/mcp/`; long-command stdout to `.context/terminal/`; compact proactively at 70%.
- Use Context7 MCP before writing code against external libraries (if installed).
- Never: setTimeout as race-condition fix · hardcoded secrets · modifying tests to make them pass · suppressing errors with empty try/catch.

## Key paths

- **Authoritative catalogs (generated from disk, never trust inlined counts):** `.claude/reference/registry.md` - refresh with `node scripts/generate-registry.js`. Rules catalog + tiers: `.claude/rules/INDEX.md`.
- YouTube transcripts: `automations/youtube/` · Notifications: `automations/notify/` + `scripts/notify.js`
- Content templates: `content-pipeline/templates/` · Voice: `content-pipeline/voice-profile/`
- Clients: `clients/` (new client → copy `clients/_TEMPLATE/`)
- Department packs: `packs/` (optional capability bundles; state in `packs/installed.json`, spec in `packs/README.md`, installer `scripts/install-pack.js`)
- Connector setup guides: `docs/connectors/` (menu: `docs/connectors/INDEX.md`)
- Env vars: ONE master root `.env` (edit there, run `node scripts/sync-env.js` to propagate; never hand-edit per-module .env files)
- Self-maintenance: `node scripts/os-lint.js` (weekly; reports drift, never auto-edits - fixes need the owner's approval)
