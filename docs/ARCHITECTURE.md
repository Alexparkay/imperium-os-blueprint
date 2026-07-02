---
title: Architecture
product: Imperium OS
type: explainer
audience: semi-technical reader
created: 2026-06-11
---

# How the OS works

This is the under-the-hood explainer. You don't need it to use the system; it exists for the moment you ask "wait, how does it actually do that?" Prefer pictures? Open [system-map.html](system-map.html) in your browser for the visual version.

## The big picture

The OS is a folder of plain text files plus Claude Code. There is no database, no server, no app to maintain. Claude reads instructions from the folder, acts through its tools (file edits, terminal commands, web access, connected services), and writes what it learns back into the folder. Because everything is text in one place, you can read any of it, version all of it, and move it anywhere.

Four ideas make it an operating system rather than a chatbot: a layered instruction system, a memory system, a skill library, and a self-improvement loop. The onboarding measures all four through one model, the Four C's, covered at the end.

## 1. The three-tier instruction layer

Claude's behaviour is shaped by instructions loaded at three depths:

**Tier 1: always-on.** `.claude/CLAUDE.md` plus the rules in `.claude/rules/`. Loaded at the start of every session, no exceptions. This is where the non-negotiables live: persist knowledge immediately, check for a skill before doing work manually, run the quality gate on deliverables, never write AI-sounding prose, never reveal items on the owner's privacy list, stress-test ideas instead of agreeing by default. Always-on space is expensive (it's read every session), so only rules that apply broadly earn a place here.

**Tier 2: on-demand rules.** `.claude/rules-import/` holds detailed rules that only matter in specific situations: how to format documents, how media storage works, how to handle large files. Tier 1 contains one-line pointers; the full rule is read only when the situation comes up. This keeps every session fast without losing depth.

**Tier 3: skills.** `.claude/skills/` holds the workflow library. Each skill is a directory containing a `SKILL.md` with a frontmatter `description` and a stepwise body (`.claude/skills/<name>/SKILL.md`). Skills load only when triggered, which is why the OS can hold dozens of workflows without slowing anything down.

The tiers exist to manage one scarce resource: Claude's attention. Broad rules always loaded, deep rules loaded when relevant, workflows loaded when invoked.

**Base vs department packs.** The live skill library starts as the ~21 engine skills every seat needs: memory, routing, quality control, research, client delivery. Department-specific workflows (content production, finance, ops, sales) ship as optional packs in `packs/` - each a bundle of skills, memory scaffolds, and templates with a manifest describing exactly what it adds. `node scripts/install-pack.js <pack>` copies a pack's skills into the live library, wires their routing, and records the install in `packs/installed.json`; uninstall reverses every byte of it. The point is per-seat leanness: a finance seat never carries YouTube packaging skills, and the routing index only ever lists workflows that can actually run. The pack spec lives at `packs/README.md`.

## 2. The memory system

The core discipline: **anything the owner says gets written to the right file immediately.** Not summarized at the end of a chat, not held in the model's head. Written, now, to a known location.

| You mention... | It lands in... |
|---|---|
| A person, contact, or relationship | `memory/people.md` |
| A goal, decision, or commitment | `memory/kanban.md` (commitments live on the board) |
| A task or deadline | `memory/kanban.md` + `memory/calendar.md` |
| Money in or out | `memory/finances.md` |
| A content idea | `memory/content/ideas_backlog.md` |
| A lesson or behaviour pattern | `memory/patterns.md` |
| A system change | `memory/system_changelog.md` |

Alongside memory sits `context/`: the short, stable truth about the company (what it is, what it sells, to whom, in what words). Context is read at the start of every session; memory is searched when needed. Context stays lean by design: pointers and one-pagers, not archives.

**Org truth vs seat truth.** Context splits in two. `context/org/` holds company-wide facts (company, offers, glossary, departments, people roster) - identical for every seat. `context/seat.md` holds this install's facts: who sits here, who actually operates the chat day to day, what this seat approves vs escalates, its KPIs. A single-seat install fills both locally during onboarding. A multi-seat company promotes `context/org/` to a read-only mirror of a shared private "org context repo": each seat pulls it at session start (`scripts/org-sync.js`), and proposes corrections upward through `memory/org-proposals/` instead of editing - so five department heads never hold five drifting versions of the company. Setup: `docs/connectors/org-sync.md`.

The payoff is continuity. Session 50 knows everything session 1 learned, because nothing important ever lived only in a chat window.

## 3. Skills and auto-triggering

A skill's frontmatter `description` doubles as its trigger definition: it states what the skill does and the phrases that should invoke it. Claude scans descriptions when you ask for something; a match means the skill runs instead of an improvised one-off. Say "what's on this week?" and the kanban workflow runs; ask for a client update email and the drafting skill loads your voice guide first.

This is the difference between a tool and an operating system: the same request gets the same proven workflow every time, and improving the skill file improves every future run.

Skills are also how the OS grows. Phase 5 of onboarding builds your first 3-5 from your actual weekly tasks, and any repeated request after that is a candidate: "make this a skill" turns today's one-off into tomorrow's standard.

## 4. Hooks: deterministic guardrails

Rules instruct; hooks enforce. A hook (`.claude/hooks/`) is a small script that the harness runs automatically at fixed moments, outside Claude's discretion:

- **At session start:** in multi-seat (org mode) installs, the shared company truth in `context/org/` is refreshed from the org context repo, so every session opens on current facts.
- **On every prompt you send:** a parser helps route long, multi-topic brain dumps so nothing in them gets dropped.
- **Before risky tool use:** protected files can't be edited or deleted; YouTube work is forced through the proper transcript tool instead of unreliable scraping.
- **After every response:** an anti-sycophancy check blocks the failure mode where the assistant reverses a recommendation just because you pushed back without new evidence. Recommendations must state what evidence would change them.

The distinction matters: an instruction can in principle be missed on a bad day; a hook cannot. Anything that must never silently fail lives in a hook.

## 5. The self-improvement loop

Two scripts keep the OS healthy as it grows:

- **`scripts/generate-registry.js`** builds a machine-readable index of every skill and rule: name, triggers, file path, last update. The registry is how the system stays aware of its own capabilities, and how "is there already a skill for this?" gets answered accurately.
- **`scripts/os-lint.js`** checks the whole system for drift: skills referencing files that no longer exist, missing frontmatter, rules pointing at dead paths, stale registry entries. Run weekly, or whenever things feel off.

The loop is: **use the system → notice friction → change a skill or rule → re-run registry + lint → review the diff → commit.** The human review gate is deliberate. The OS proposes its own improvements and fixes mechanical problems, but a person approves changes to how it behaves. Because everything is text under version control, every change is visible and reversible.

This is why the system gets better with use instead of decaying: corrections become rule edits, repeated requests become skills, and the lint catches rot before you feel it.

## The Four C's

The model behind onboarding and the weekly health check. Each scored out of 10:

- **Context.** Does the system know the business? (Identity, company one-pager, offers, glossary, voice profile, privacy list.)
- **Connections.** Is it plugged into where the work happens? (GitHub backup, email and calendar, research tools, notifications, optional extras.)
- **Capabilities.** Can it do the work? (Skills built, each proven on at least one real run.)
- **Cadence.** Does work happen on rhythm? (What runs scheduled vs on-demand, the task board, the weekly health re-check.)

Onboarding walks the four in order: Phases 1-3 build Context, Phase 4 builds Connections, Phase 5 builds Capabilities, Phase 6 sets Cadence, and Phase 7 records the baseline scores. Day-one scores are low on purpose; the weekly re-check is where you watch them climb, and a C that stalls tells you exactly where to invest next.

## What keeps it safe

- **Local first.** The folder lives on your machine. The only things that leave it are requests to services you connected yourself.
- **Secrets stay out of backups.** Keys live in `.env`, which is excluded from version control by default.
- **Human-in-the-loop on irreversible actions.** Nothing is sent, posted, or invoiced without sign-off, per the guardrails you set in onboarding.
- **Everything is reversible.** Text + git means any change, by you or the system, can be inspected and rolled back.
