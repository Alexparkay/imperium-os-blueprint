---
name: os-lint
description: "Weekly self-maintenance loop for the operating system itself. Runs scripts/os-lint.js (deterministic drift detection: dead pointers, catalog drift, stale memory targets, instruction-budget creep, duplicate rules, naming violations, mojibake, git hygiene), then triages the report, proposes fixes ranked by impact, applies ONLY approved or trivial fixes, and logs to the changelog. Trigger: 'os lint', 'lint the system', 'system health', 'self-improve', 'maintenance pass', weekly cadence, or after any big structural change to .claude/, memory/, or context/."
metadata:
  title: OS Lint - Self-Improvement Loop
  tags:
    - "system"
  type: skill
  status: active
  created: 2026-06-10
  updated: 2026-06-11
---

# OS Lint - the self-improvement loop with a review gate

This skill is the OS maintaining itself. The wiki-lint pattern applied to the whole
command centre: build + lint, not build + rot. The deterministic checks live in code
(`scripts/os-lint.js`); the judgment lives here; the approval lives with the owner.

## Why the review gate exists (do not remove it)

Verified failure modes of self-modifying agent systems: behavioral drift (agent
silently rewrites instructions), spec drift, context bloat, reward hacking, uncontrolled
self-modification. The consensus guardrail set: versioned self-edits, human review gate
before instruction changes go live, periodic lint with rollback. That is this skill.

## The loop

1. **Run** `node scripts/os-lint.js`. Report lands at `.context/lint/YYYY-MM-DD.md`.
2. **Triage** every CRITICAL and WARN into one of:
   - **TRIVIAL** - regenerate registry, gitignore additions, fixing a typo'd path, archiving
     an explicitly-disabled skill. Apply immediately, note in changelog.
   - **STRUCTURAL** - editing/moving/deleting rules or skills, changing CLAUDE.md, retiring
     memory targets, renaming conventions. Propose to the owner with evidence + expected effect.
     Apply ONLY what they approve.
   - **JUDGMENT** - stale-but-maybe-intentional things (e.g. a memory file untouched 60 days
     that might be deliberately dormant). Ask, don't assume.
3. **Apply** approved fixes. One commit per category, descriptive messages.
4. **Log** a dated entry in `memory/system_changelog.md`: findings → fixes applied → fixes
   deferred. This is the audit trail that makes self-improvement compound instead of rot.
5. **Re-run** the script. CRITICAL must be 0 after the pass; WARNs may persist if deferred.

## Cadence

- Weekly (good slot: Monday morning, before the week's work), and
- After any big structural change to `.claude/`, `memory/`, `context/`, or `clients/`.
- Can run via `/loop` while the owner works, or a scheduled session. Keep it under 15 minutes.

## What the deterministic script checks (extend it, don't duplicate it here)

Dead pointers in the always-on layer · path-casing violations · rule duplication across
tiers · catalog drift (registry vs routing index vs disk) · stale persistence targets
(>45d) · instruction budget (warn >16k tokens always-on) · naming conventions ·
mojibake · git hygiene. New failure mode discovered → add a check to `scripts/os-lint.js`
in the same session (that's the "learning constantly" half of this loop).

## Hard rules

- The script REPORTS, this skill PROPOSES, the owner APPROVES structural changes. No exceptions.
- Never keep two copies of the same rule across tiers (always-on vs rules-import). One copy, one source of truth.
- Never let the always-on instruction layer grow past ~16k tokens without a trim in the
  same week. The bar for a new ALWAYS rule is: "must shape every single response."
- Every applied fix gets a changelog line. Unlogged self-modification is drift.

---

## Related

- [[memory-dream]] (memory consolidation - complementary; dream = content, lint = structure)
- [[project-health]] (runtime/services diagnostic - complementary; health = services, lint = instructions)
- [[quality-gate]]
