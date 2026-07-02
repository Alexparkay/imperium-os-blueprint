# Changelog

All notable changes to Imperium OS. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning follows [SemVer](https://semver.org/). Versions 0.1.0-0.2.1 are donor lineage (pre-repo, no dates recorded); everything under Unreleased landed in this repository on 2026-07-02.

## [Unreleased] - 1.0.0-dev

### Added

- **M2 - Department packs.** Optional packs (content-marketing, finance, ops, sales-crm) with `scripts/install-pack.js` install/uninstall (exact-reverse, rollback on conflict) and a pack-integrity lint check.
- **M3 - Org layer.** `context/org/` (company truth) vs `context/seat.md` (this seat) split, `scripts/org-sync.js` read-only mirror sync with a SessionStart hook, propose-upward flow via `memory/org-proposals/`, and the org-context rule (32).
- **M5 - Persona.** `context/identity.md` persona layer (named via the `OS_NAME` placeholder) plus the `self-improve-nudge` Stop hook (report-only).
- **M6 - Dormant operating layer.** Brain core contract (`brain/`: RLS-forced Postgres schema, append-only audit log, approval queue), fixtures-first worker hub (`automations/worker/`: zero-credential boot, every response stamped `"source": "fixtures"`), and the cockpit contract (`dashboard/README.md`, SEED DATA badge requirement).
- **M7 - Packaging guardrails (this commit).** `scripts/package-check.js` pre-release/pre-delivery gate: scrub-blacklist sweep, donor-branding check, external-domain-leak check, seed single-source integrity, SEED DATA badge contract, placeholder inventory (zero-survivor in `--client` mode). Plus `docs/conventions/seed-data.md`, a WARN-level seed-integrity check in `os-lint.js` (shared helper `scripts/lib/seed-utils.js`), and this changelog.

### Changed

- **M1 - Skill directory migration.** All 44 skills moved from flat files to `<name>/SKILL.md` directories with agentskills-compatible frontmatter; registry, lint, and routing references updated.
- **M2 - Base slimmed to 21 engine skills.** Department-specific skills moved out of the base and into their packs.
- **M7 - README install step re-neutralised.** The clone instruction no longer hardcodes a personal GitHub URL (donor-branding leak caught by the new gate).

### Security

- Scrub-blacklist mechanism ships with the repo; the list itself stays maintainer-local and gitignored (`scrub-blacklist.local.json`).

## [0.2.1]

### Added

- Public-release README.

## [0.2.0]

### Changed

- Onboarding hardened via two full overnight install simulations against real personas (an external multi-business CEO and an in-house creative director); every verified install bug fixed.

## [0.1.0]

### Added

- Engine extracted from the founder's master OS: rules, skills, memory system, hooks, registry, and lint.
