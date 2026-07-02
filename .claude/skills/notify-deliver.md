---
title: Notify Delivery
tags:
  - "system"
type: skill
status: active
created: 2026-04-02
updated: 2026-06-11
description: Route files and artifacts to the owner's notify channel (Telegram by default). Use after generating NotebookLM artifacts, research outputs, content drafts, or any file the owner needs on mobile. Handles channel selection, caption formatting, and delivery confirmation.
name: notify-deliver
---

# Notify Delivery

Send files and artifacts to the owner via the configured notify channel. The default module is the Telegram notify bot at `automations/notify/` (set up during onboarding Phase 4; channel config = `{{NOTIFY_CHANNEL}}`).

## Delivery Command

```bash
cd {{REPO_PATH}} && node automations/notify/notify.js "<description>" --file <path>
```

For plain text notifications (no file), use the lighter script:

```bash
node {{REPO_PATH}}/scripts/notify.js "<brief message>" --summary "<key findings>"
```

## Routing

The template ships with ONE notify channel. If the owner later adds multiple channels/bots (e.g. separate research, content, and code channels like the parent OS uses), route by content type:

| Content Type | Channel | Examples |
|-------------|-----|---------|
| Research artifacts | research | NotebookLM podcasts, deep dives, briefings, research reports |
| Content drafts | content | Newsletter drafts, video scripts, LinkedIn posts, content briefs |
| Code artifacts | code | Generated files, screenshots, logs, technical outputs |
| Strategy docs | research | Business plans, competitive analysis, dossiers |

Until then, everything goes to the single default channel.

## Rules

1. **Always use absolute paths** for the --file parameter
2. **Caption format:** Brief, descriptive. Include what it is and why it matters.
   - Good: "NotebookLM podcast on industry trends - 15 min deep dive"
   - Bad: "Here's a file"
3. **Confirm delivery** - check the command output for success
4. **Multiple files** - send one at a time, each with its own caption
5. **NotebookLM artifacts ALWAYS get delivered** - the owner should never have to hunt for a generated artifact on disk

## After Delivery

Report to the owner:
```
DELIVERED via [channel]:
- [filename] - [caption]
- Status: [SUCCESS/FAILED]
```

If delivery fails, check:
1. Is the file path correct?
2. Is the notify module configured? (`automations/notify/` setup doc)
3. Is the `.env` configured with the bot token / chat id?

---

## Related

- [[project-health]]
- [[media-hub]]
