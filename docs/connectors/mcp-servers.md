---
title: MCP Servers
product: Imperium OS
type: connector-guide
status: optional
created: 2026-06-11
---

# MCP servers (optional)

MCP stands for Model Context Protocol. In plain English: an MCP server is a plug-in that gives the system a new set of abilities, like browsing websites, reading a database, or controlling another app. Claude Code supports them natively, and your operating system can use as many as you find useful.

You don't need any of these on day one. Connect them when a real need shows up, which usually sounds like the system saying "I could do this better with the [X] integration; want me to set it up?"

## How adding one works

Always the same shape, whatever the server:

1. You (or the system) pick a server for the ability you want.
2. The system adds it to the project's MCP configuration. This is one command or one small edit to a config file, and the system does it.
3. If the server needs an account key, you copy it from the service's website and paste it into the chat. The system stores it in the local settings file.
4. Restart the chat session so the new abilities load.
5. Verify with a real request.

To start at any time, just say:

```
Add an MCP server for [the thing you want]
```

## Three examples worth knowing

### 1. Browser control (Playwright)

Lets the system drive a real web browser: open pages, click buttons, fill forms, take screenshots. Useful for checking your own website, testing a signup flow, or pulling information from sites without a proper export.

- **Needs a key:** no.
- **Verify with:** "Open my website in a browser and screenshot the homepage."

### 2. Up-to-date code documentation (Context7)

When the system writes or fixes anything technical, this server feeds it current documentation for the tools involved, instead of relying on what the model remembered from training. Result: fewer errors in technical work.

- **Needs a key:** no, for basic use.
- **Verify with:** ask a question about a current software library and check the answer cites fresh docs.

### 3. Web scraping and search (Firecrawl)

Turns messy web pages into clean text the system can actually work with, and runs proper web searches with full page content. Useful for competitor research, lead research, and monitoring pages for changes.

- **Needs a key:** yes, from firecrawl.dev (free tier exists).
- **Verify with:** "Use Firecrawl to pull the content of [a page you know] and summarize it."

## Good habits

- **Add servers for needs, not for fun.** Every server loads abilities into each session; a long list of unused ones slows things down.
- **One at a time, verify each.** Same rule as every other connector.
- **Keys go in the settings file, never in chat history or documents.** The system enforces this; if you ever spot a key written anywhere else, tell it.
- **Review the list quarterly.** Ask "which MCP servers do we have and when were they last used?" and prune the dead ones.

## What can go wrong

- **New abilities don't show up.** The session needs a restart after adding a server. Close and reopen the chat.
- **A server errors on every use.** Usually an expired or mistyped key. Say "fix the [name] MCP connection" and re-paste the key when asked.
- **You don't know if a server exists for what you want.** Just ask: "is there an MCP server that can [X]?" The system will research it and give you a recommendation with reasons.
