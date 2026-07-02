---
title: Installing Claude Code
product: Imperium OS
type: connector-guide
status: required
created: 2026-06-11
---

# Installing Claude Code

Claude Code is the app this whole system runs in. This is the one guide you follow before the system can help you, so it's written assuming nothing.

**Time:** about 10 minutes.
**You need:** a Claude account on a paid plan. The Max plan is recommended; it gives the system room to work all day without hitting usage limits.

## Step 1: Get a Claude account

1. Go to **https://claude.ai** in your browser.
2. Sign up with your work email, or sign in if you already have an account.
3. Upgrade to a paid plan (Settings, then Billing). If you'll use this system daily, pick Max.

## Step 2: Install Claude Code (pick one route)

### Route A: inside Cursor or VS Code (easiest if you already use either)

1. Open Cursor (or VS Code).
2. Click the Extensions icon in the left sidebar (it looks like four squares).
3. Search for **"Claude Code"**.
4. Click **Install** on the official Anthropic extension.
5. A Claude icon appears in the sidebar. Click it and sign in with your Claude account. A browser window opens; click **Authorize**.

### Route B: the standalone install

1. Go to the official install page: **https://claude.com/claude-code** (it detects your computer and shows the right download or command).
2. Follow the page's instructions for Windows or Mac. If it shows a command to copy, that's normal; it's a one-time step.
3. When install finishes, open your project folder with Claude Code and sign in when prompted.

If anything on the official page looks different from this guide, follow the page. It's always current.

## Step 3: Open this folder as a project

1. In Claude Code (or Cursor), choose **File, then Open Folder**.
2. Select the folder you received (the one containing this `docs` folder and a `README.md`).
3. Open the chat panel.

## Step 4: Verify it works

Type this into the chat:

```
I've just installed this, let's start
```

If the system replies with a welcome and a tour, you're done. Everything from here on is guided from inside the chat.

## What can go wrong

- **"I can't find the chat."** In Cursor/VS Code, click the Claude icon in the left sidebar. In the standalone app, the chat is the main window.
- **Sign-in loops back to the browser.** Close all Claude browser tabs, restart the app, sign in once more.
- **It says I'm out of usage.** You're on a plan that's too small for daily system use. Upgrade the plan at claude.ai, then continue; nothing is lost.
- **Anything else.** Once you're signed in at all, describe the problem in the chat itself. Fixing its own setup issues is something this system is good at.
