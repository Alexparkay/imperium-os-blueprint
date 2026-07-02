---
title: Telegram Notifications
product: Imperium OS
type: connector-guide
status: recommended
created: 2026-06-11
---

# Telegram notifications

This connector gives the system a way to reach your phone. When it finishes a research job, publishes something, or completes a long task, your phone buzzes with the result. You'll create a private bot that only talks to you.

**Time:** about 10 minutes.
**Cost:** free.

## What you do vs what the system does

You create the bot inside the Telegram app and paste two things into the chat: a key and a message. The system figures out the rest and wires it up.

## Step 1: Install Telegram (skip if you have it)

1. Install **Telegram** from your phone's app store and sign up with your phone number.
2. Optional but handy: install Telegram Desktop too, so notifications also land on your computer.

## Step 2: Create your bot with BotFather

BotFather is Telegram's official bot for making bots. Inside Telegram:

1. Tap the search icon and type **BotFather**. Open the one with the blue verified tick.
2. Tap **Start**.
3. Send the message: `/newbot`
4. It asks for a **name**. This is the display name; something like `Company OS` is good.
5. It asks for a **username**, which must end in `bot` and be unused, like `yourcompany_os_bot`.
6. BotFather replies with a congratulations message containing a **token**: a long string like `1234567890:AAAbbbCCCddd...`. Tap it to copy.

## Step 3: Give the token to the system

Paste it into the chat:

```
Here's my Telegram bot token: [paste]
```

The system saves it to the local settings file (`.env`, as `TELEGRAM_BOT_TOKEN`) and won't echo it back.

## Step 4: Say hello to your bot

The bot can only message people who have messaged it first. So:

1. In Telegram, search for the **username** you created in Step 2 (e.g. `yourcompany_os_bot`).
2. Open it and tap **Start** (or send any message, like "hello").
3. Tell the chat: **"Done, I've messaged the bot."**

The system then looks up your chat id (the address your messages come from), saves it as `TELEGRAM_CHAT_ID`, and finishes the wiring.

*(For the system: there is no helper script for this step - call the Bot API directly: `curl -s "https://api.telegram.org/bot<TOKEN>/getUpdates"` and read `result[0].message.chat.id` from the reply to their hello message. Never echo the token.)*

## Step 5: Verify

The system runs the notifier (`automations/notify/notify.js`) with a test message. Within a few seconds your phone should buzz with something like:

> Connected. This is where your results will arrive.

Got it? The connector is live. From now on, finished work finds you.

## What can go wrong

- **No test message arrives.** Most often Step 4 was skipped: the bot can't speak first. Open your bot in Telegram, send it any message, then say "retry the Telegram test".
- **"Unauthorized" error.** The token was copied with a missing character. Copy it again from the BotFather message and paste it fresh.
- **You lost the token.** In BotFather, send `/mybots`, pick your bot, tap **API Token**. You can also use `/revoke` there to invalidate an old token and get a new one (then give the new one to the chat).
- **Messages arrive on desktop but not your phone.** That's a Telegram notification setting on the phone: check Settings, Notifications inside the Telegram app.
