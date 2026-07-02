---
title: Apify (YouTube Research)
product: Imperium OS
type: connector-guide
status: recommended
created: 2026-06-11
---

# Apify: YouTube research

Apify is the service the system uses to pull full transcripts from YouTube videos, reliably and without scraping tricks. Once connected, you can paste any YouTube link into the chat and say "what's in this video?", "summarize this", or "research this creator", and the system reads the whole transcript before answering.

**Time:** about 5 minutes.
**Cost:** Apify has a free monthly credit that covers light use. Heavy research use costs a small amount per video; you can see usage anytime in your Apify dashboard.

## What you do vs what the system does

You create the account and copy one key into the chat. The system stores it safely and runs every transcript job from then on.

## Step 1: Create an Apify account

1. Go to **https://apify.com** and click **Sign up**. Free plan is fine to start.
2. Verify your email.

## Step 2: Get your API key

1. Sign in to Apify.
2. Click your profile picture (top right), then **Settings**.
3. Find the **API & Integrations** section (it may be a tab called "API").
4. You'll see a **Personal API token**: a long string of letters and numbers. Click the copy icon next to it.

## Step 3: Give the key to the system

Paste it into the chat like this:

```
Here's my Apify key: [paste]
```

The system writes it into the local settings file (`.env`, under the name `APIFY_API_TOKEN`), confirms it's saved, and never shows the key in chat again. The settings file stays on your machine and is excluded from backups.

## Step 4: Verify

Ask the chat:

```
Test the YouTube connection on this video: [paste any YouTube link]
```

Behind the scenes it runs the transcript tool (`automations/youtube/transcripts.js`) against that link. If you get back a summary with real quotes from the video, the connector is live.

## What can go wrong

- **"Invalid token" on the test.** A character got lost in the copy. Copy the token again from Apify Settings and paste it fresh; the system will replace the stored one.
- **The test hangs for a long time.** Long videos take a minute or two. If it's been more than five, say "cancel and retry the YouTube test" and try a shorter video.
- **"Out of credit" errors after heavy use.** Your free monthly credit ran out. Add a payment method in the Apify dashboard, or wait for the monthly reset.
- **A specific video fails but others work.** Some videos have no captions in any language and can't be transcribed this way. The system will tell you when that's the case.
