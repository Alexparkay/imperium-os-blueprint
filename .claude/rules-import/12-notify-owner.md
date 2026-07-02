---
title: "MANDATORY: Notify the Owner When Tasks Complete"
type: rule
status: active
created: 2026-06-11
---

# MANDATORY: Notify the Owner When Tasks Complete

After completing ANY significant task (research, code, content, analysis, builds, deployments), send a notification with the results via the configured notify channel ({{NOTIFY_CHANNEL}}, set up during onboarding Phase 4; guide: `docs/connectors/telegram-notify.md`):

```bash
node {{REPO_PATH}}/scripts/notify.js "BRIEF DESCRIPTION OF WHAT WAS DONE" --summary "KEY FINDINGS OR RESULTS"
```

**Examples:**

```bash
node scripts/notify.js "Research complete: competitor analysis for 5 channels"
node scripts/notify.js "Code deployed: new dashboard feature" --summary "Added weekly revenue chart\nDeployed to production"
node scripts/notify.js "Content ready: post draft in content-pipeline/drafts/"
```

**Rules:**

1. Include the ACTUAL findings or results in the --summary, not just "task done"
2. Keep the main message under 1 sentence
3. Put details in --summary (supports \n for newlines)
4. Send AFTER committing and pushing (rules-import/06), not before
5. Skip for: trivial file moves, memory updates, conversational responses

**WHY:** The owner may monitor multiple sessions from their phone. They need to know WHAT was found or built, not just that something finished.

**If the notify channel is not configured yet:** skip silently and mention in chat that notifications can be enabled in onboarding Phase 4.
