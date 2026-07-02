---
name: project-health
description: "Health check + Four Cs audit across all OS systems - automations, memory files, content pipeline, git status, deployments, AND a Context/Connections/Capabilities/Cadence scorecard with a reliability/safety check. Use when the owner says \"status\", \"what's the state\", \"health check\", \"audit\", \"four cs\", \"is everything running\", or at session start."
metadata:
  title: Project Health Check
  tags:
    - "system"
  type: skill
  status: active
  created: 2026-04-02
  updated: 2026-06-11
---

# Project Health Check

Run a quick diagnostic across all systems in the OS.

## Checks to Run

### 1. Git Status
```bash
cd {{REPO_PATH}} && git status && git log --oneline -5
```
- Any uncommitted changes?
- Any untracked files that should be committed?
- Last 5 commits (are they recent?)

### 2. Automations
```bash
ls {{REPO_PATH}}/automations/
```
- Check the notify module is configured (`automations/notify/`)
- Check the YouTube module has its Apify token set (`automations/youtube/`, `APIFY_API_TOKEN` in `.env`)
- If the owner deploys any automation to a host (Railway, a VPS, etc.), compare last git push to last deploy

### 3. Memory Freshness
Check last modified dates on key memory files:
```bash
ls -la memory/owner_profile.md memory/kanban.md memory/calendar.md memory/people.md memory/content/ideas_backlog.md memory/system_changelog.md
```
- Flag any file not updated in >7 days as potentially stale
- Check `memory/system_changelog.md` for recent entries

### 4. Content Pipeline
```bash
ls -la content-pipeline/drafts/ content-pipeline/published/ 2>/dev/null
```
- Any drafts in progress?
- Recent publications?
- Ideas backlog size

### 5. Skills & Rules
```bash
ls -la .claude/skills/ .claude/rules/ .claude/hooks/
```
- All skills present?
- All rules loaded?
- All hooks active?

## Output Format

```
PROJECT HEALTH - [date]

GIT: [CLEAN/DIRTY] - [uncommitted count] uncommitted, last commit [date]
AUTOMATIONS: [OK/STALE] - notify [configured/missing], youtube [configured/missing], [deploy status if applicable]
MEMORY: [FRESH/STALE] - [list stale files if any]
CONTENT: [ACTIVE/IDLE] - [drafts in progress], [recent publishes]
SKILLS: [X] project skills, [X] rules, [X] hooks

ACTIONS NEEDED:
- [list any issues that need attention]
```

## Four Cs Audit (the OS scorecard)

Score each C 0-10 and give one concrete gap. This doubles as the weekly health audit the owner runs to know the OS is pulling its weight.

| C | Test | How to check |
|---|---|---|
| **Context** | A fresh session answers "what does this business do + who works here?" without browsing | Does `context/index.md` + `context/org/company.md` exist and load? Is it current vs `memory/business/`? |
| **Connections** | Live data queries return real data | Are MCP servers reachable? gws CLI authed? Apify token set? Notify channel working? |
| **Capabilities** | A short phrase triggers a multi-step workflow that ships an artifact | Spot-check 2-3 skills still run end-to-end |
| **Cadence** | Work happens with the laptop closed | Which crons/routines are enabled? Any automations live on a host 24/7? |

## Reliability / Safety check (run with the audit)
- **Secrets:** no API keys committed (`git grep -nE "sk-|api_key|token" -- . ':!*.env'` style spot check); `.env` gitignored.
- **Kill switch / human-in-loop:** no automation auto-sends/auto-posts/auto-invoices without approval.
- **Broken paths:** key referenced files still exist (`memory/kanban.md`, `content-pipeline/voice-profile/`, `context/index.md`).
- **Stale memory:** flag memory files untouched >30 days that claim to be "current".
- **Instruction layer:** rule count vs `.claude/rules/INDEX.md`; flag if always-on rules drift above ~15.

Output a Four Cs line: `CONTEXT x/10 · CONNECTIONS x/10 · CAPABILITIES x/10 · CADENCE x/10` plus the top reliability risk.

---

## Related

- [[memory-dream]]
- [[os-lint]]
- [[quality-gate]]
