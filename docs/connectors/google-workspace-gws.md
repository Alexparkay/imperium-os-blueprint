---
title: Google Workspace (gws)
product: Imperium OS
type: connector-guide
status: recommended
created: 2026-06-11
---

# Google Workspace

This connector lets the system work with your Google account: read and create Docs and Sheets, check your Calendar, search Drive, and read Gmail. It uses a command-line tool called `gws` that the system operates for you; you never use it directly.

**Time:** 10 to 20 minutes. The fiddly part is a one-time Google approval flow, and the system walks you through every click.
**Skip if:** your company doesn't run on Google (e.g. you're a Microsoft 365 shop). Tell the chat and it will note it; an alternative can be set up later.

## What you do vs what the system does

The system installs the tool and runs every command. Your jobs: be signed into the right Google account in your browser, click Allow when Google asks, and (only if Google requires it for your account) create one set of access credentials with the system guiding each click.

## Step 1: Tell the system to start

In the chat, say:

```
Set up Google Workspace access
```

It will install the `gws` tool and check what your Google account needs. Then it walks you through one of two paths:

## Step 2, Path A: simple sign-in (most personal and small-business accounts)

1. The system starts the sign-in. A browser window opens.
2. Make sure you're signed into the **work account** you want connected (the email you gave during onboarding).
3. Google shows a consent screen listing what's being requested (Docs, Drive, Calendar, Gmail). Click **Allow**.
4. The browser says you can close the window. Done; jump to Verify.

## Step 2, Path B: your account needs its own credentials

Some Google accounts (especially company Workspace accounts with stricter admin settings) require you to create your own access credentials first. It's a one-time browser task. The system will give you the exact clicks live, but the shape of it is:

1. Go to **https://console.cloud.google.com** and sign in with your work account.
2. Create a project (any name, like "Company OS").
3. Turn on the APIs the system lists for you (Drive, Docs, Sheets, Calendar, Gmail).
4. Create an "OAuth client" credential and download the small file Google gives you.
5. Tell the chat where the downloaded file is (usually your Downloads folder). The system moves it to the right place, locks it down, and runs the sign-in from Path A.

If any screen doesn't match what the system describes, screenshot it or describe it in the chat. Google moves these menus around; the system will reorient.

## Step 3: Verify

Ask the chat:

```
What's on my calendar this week?
```

If it answers with your real events, the connector is live. As a second check, ask it to create a Google Doc called "Connection test" and confirm the doc appears in your Drive. You can delete it after.

## What can go wrong

- **Google shows a scary "unverified app" or "Google hasn't verified this app" screen during sign-in.** This is normal for a personal command-line connection (it's YOUR connection to YOUR account, not a published app). Click "Advanced" then "Go to ... (unsafe)" - the wording is alarming but the access is the one you're granting yourself. If you're not comfortable, stop and do this connector with the build team instead; nothing else depends on it today.

- **Wrong account got connected.** Say "disconnect Google and redo the sign-in", then make sure the right account is chosen on Google's account picker.
- **Google blocks the sign-in with a warning screen.** On unverified credentials this is normal: click "Advanced", then "Go to [project name]". It's your own credential; you're trusting yourself.
- **Your company admin controls app access.** You may need your Workspace admin to approve the connection. The system can draft the request email for you.
- **It worked last month and stopped.** Sign-ins expire occasionally. Say "refresh the Google connection" and re-approve. Sixty seconds.
