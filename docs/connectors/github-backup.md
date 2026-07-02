---
title: GitHub Backup
product: Imperium OS
type: connector-guide
status: required
created: 2026-06-11
---

# GitHub Backup

GitHub keeps a private, versioned copy of your entire operating system in the cloud. If your laptop dies, nothing is lost. Every change the system makes is recorded, so anything can be rolled back. This is the first connector for a reason.

**Time:** about 10 minutes.
**Privacy note:** the repository is private. Only your account can see it. Your secret keys (the `.env` file) are excluded from backup automatically.

## What you do vs what the system does

You create the account and the empty repository in your browser, and approve one sign-in. The system does all the rest: it prepares the files, connects the folder to your repository, and pushes the backup.

## Step 1: Create a GitHub account (skip if you have one)

1. Go to **https://github.com/signup**.
2. Sign up with your work email. Free plan is fine.
3. Verify your email when the confirmation arrives.

## Step 2: Create a private repository

1. Once signed in, go to **https://github.com/new**.
2. **Repository name:** something simple, like `company-os`.
3. **Visibility:** select **Private**. This matters.
4. Leave every other option unticked (no README, no license; the folder already has those).
5. Click **Create repository**.
6. Copy the page's web address (it looks like `https://github.com/yourname/company-os`) and paste it into the chat.

## Step 3: Let the system connect

Back in the chat, say:

```
Connect this folder to my GitHub repository: [paste the address]
```

The system will:

1. Check that git is installed on your machine, and install or guide the install if not.
2. Sign you into GitHub from this machine. A browser window will open and ask you to approve; click **Authorize**. You may be shown a short code to type into the browser; the system will tell you exactly what to do.
3. Check for folders that are themselves git projects (`find . -name .git -not -path "./.git*"`). Any found get added to the ignore list FIRST and you're told what was excluded and why - otherwise they'd be saved as broken pointers and silently missing from your backup (this bites anyone who clones a dashboard or tool inside their system).
4. Point the folder at your repository and push the first backup.
5. From then on, push a backup automatically every time it finishes a piece of work.

## Step 4: Verify

Refresh your repository page in the browser. You should see the folders (`context`, `memory`, `docs`, and the rest) listed. If you can see them, backup is live.

Two more checks worth doing once:

- Confirm the page says **Private** near the repository name.
- Confirm there is **no `.env` file** in the list. (There shouldn't be; it's excluded by design.)

## What can go wrong

- **The browser approval never appears.** Tell the chat "the GitHub sign-in didn't open" and it will give you a direct link to approve.
- **Push rejected or permission denied.** Usually a sign-in that didn't finish. Say "retry the GitHub connection" and approve the browser prompt again.
- **You see a `.env` file on GitHub.** Stop and tell the chat immediately: "the env file got backed up". It will remove it from the repository and rotate anything sensitive with you.
- **You created the repo as Public by accident.** On the repository page: Settings, scroll to the Danger Zone, "Change visibility", set to Private.
