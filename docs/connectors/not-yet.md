---
title: Connectors we don't have yet
product: Imperium OS
type: connector-guide
status: honest-gaps
created: 2026-06-11
---

# Connectors we don't have yet (and what to do meanwhile)

The starter kit ships connectors for backup, Google Workspace, YouTube research, phone notifications, and optional media/WhatsApp/image tools. These are the most-requested connectors that DON'T exist yet. If you want one, say so in the chat — it gets logged in your state file and raised with the build team. Never let the system pretend a pipe exists.

## Social analytics (Instagram / TikTok / YouTube Studio insights)
*The most common ask from anyone running content: "which hook won on our last reel?"*
- **Today:** export insights from the app (IG: Professional dashboard → export; YouTube: Studio → Analytics → export) into `content-pipeline/research/analytics/` as CSV — the system reads the files and answers from them. A monthly export habit gets you 90% of the value.
- **Full build:** platform-API connectors are scoped per engagement (each platform has its own approval hoops).

## Transcription (AssemblyAI / Whisper)
Several shipped skills (podcast and Dropbox transcription, intro forensics) depend on an `ASSEMBLYAI_API_KEY` and on automation modules that are NOT in the starter kit (see each skill's "OPTIONAL MODULE" note). Those modules are installed by the build team during a full engagement, or built on request. Meanwhile: if your media store already contains `.transcript.txt` files (many do), the skills can work from those directly.

## CRM / project tools (HubSpot, Asana, Slack, QuickBooks, Fathom...)
The heavy stack. No plug-in connectors in the starter kit — these are exactly what a full build wires in (typically via MCP servers or per-tool APIs, on your accounts). Until then the pattern is: export or paste, and the system files it. Say "I keep needing my [tool] data" so the want is on record with dates.

## Accounting-grade finance
`memory/finances.md` + the financial-accuracy rule define the discipline, but bank/accounting feeds are full-build scope. The system must answer money questions with "that lives in [tool]; that pipe isn't connected yet" — never with a guess.
