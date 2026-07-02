# Notify (Telegram)

A single-file Telegram notifier so the OS can ping {{OWNER_SHORT}}'s phone when long-running work finishes: research done, report built, deploy complete. No dependencies, runs with bare Node.

## What it does

```bash
node automations/notify/notify.js "Research complete: 5 competitor channels analysed"
node automations/notify/notify.js "Weekly report built" --summary "Highlights:\n- Pipeline up\n- 2 drafts ready"
```

- The main message should say WHAT was found or built, in one sentence
- `--summary` carries the detail (supports `\n` for line breaks)
- Messages over Telegram's limit are truncated safely
- If the env vars aren't set, it prints "Notify not configured" and exits cleanly (code 0), so nothing that calls it ever breaks on an unconfigured install

## Setup (onboarding Phase 4 walks through this)

1. Message @BotFather on Telegram → `/newbot` → copy the bot token
2. Start a chat with your new bot (send it any message)
3. Get your chat id: open `https://api.telegram.org/bot<TOKEN>/getUpdates` in a browser and read `chat.id` from the response
4. Add both to the repo root `.env`:

```
TELEGRAM_BOT_TOKEN=123456:ABC-your-token
TELEGRAM_CHAT_ID=123456789
```

5. Test: `node automations/notify/notify.js "Notify is live"`

The full guide with screenshots lives at `docs/connectors/telegram-notify.md`. Once configured, the OS's notify rule uses this script after every significant completed task.
