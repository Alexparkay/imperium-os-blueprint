---
title: Dropbox Media Storage (rclone)
product: Imperium OS
type: connector-guide
status: optional
created: 2026-06-11
---

# Dropbox media storage (optional)

Connect this if your business produces big files: podcast recordings, raw video, photo shoots, design assets. The system gets the ability to list, search, and stream your Dropbox content without ever downloading huge files onto your computer. It uses a tool called rclone that the system operates for you.

**Skip if:** you don't work with large media files, or you keep media somewhere else. You can connect this any time later by saying "set up Dropbox".

**Time:** about 10 minutes.

## Why streaming matters (30 seconds of theory)

Video and audio files are huge. If the system copied them to your computer every time it needed one, your disk would fill up within weeks. Instead, it streams: it reads the parts it needs over the internet and writes nothing big to your disk. You'll see this rule enforced everywhere in the system; this connector is where it starts.

## What you do vs what the system does

The system installs rclone and runs the connection flow. You approve one Dropbox sign-in in your browser.

## Step 1: Have a Dropbox account ready

Any plan works to start. Know which account holds (or will hold) your media, and be signed into it in your browser.

## Step 2: Tell the system to start

In the chat:

```
Set up Dropbox media storage
```

It installs rclone (a free, widely used tool for connecting to cloud storage) and starts the connection.

## Step 3: Approve the sign-in

1. A browser window opens on a Dropbox permission screen.
2. Check it's the right account (top right of the page).
3. Click **Allow**.
4. The browser confirms; you can close the tab. Tell the chat "done".

## Step 4: Tell it where your media lives

The system asks one question: which folder in your Dropbox is the home for business media (for example, a folder called `Content`). If you don't have one yet, it will create a tidy structure for you and explain it. This location becomes the system's standard media home.

## Step 5: Verify

Ask the chat:

```
List what's in my Dropbox media folder
```

If it lists your real folders and files, the connector is live. As a stress test, ask it about a large file ("how long is the video in [folder]?"); it should answer without downloading the file.

## What can go wrong

- **The list comes back empty but you KNOW files exist.** Your Dropbox is a Business/team account and the files live in a team space - the default connection only sees the personal root. Tell the chat: "my dropbox lists empty". The system will detect it (empty root listing + non-zero usage in `rclone about`) and reconnect using the team namespace (`--dropbox-root-namespace <team-ns-id>`). Common on exactly the accounts businesses have; takes one minute.

- **The browser sign-in shows the wrong account.** Sign out of Dropbox in the browser, sign into the right account, then say "retry the Dropbox connection".
- **"Token expired" weeks later.** Sign-ins age out occasionally. Say "refresh the Dropbox connection" and approve once more.
- **The system seems to be downloading something huge.** It shouldn't, by rule. If you ever see your disk filling, say "stop, you're downloading media" and it will halt and switch to streaming.
