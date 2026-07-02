---
title: "MANDATORY: YouTube Transcript via Apify"
type: rule
status: active
created: 2026-06-11
---

# MANDATORY: YouTube Transcript via Apify

When ANY YouTube URL appears in conversation, or the user says "transcribe", "watch this", "what does this video say", "research this video", "check this video", or references any YouTube content:

**STEP 1 (non-negotiable):** Run the Apify transcript extractor:

```bash
cd {{REPO_PATH}}/automations/youtube && node transcripts.js "<youtube-url>"
```

Bulk extraction: `node bulk-chase.js <outDir> <url1> <url2> ...`

Requires `APIFY_API_TOKEN` in the root `.env` (see `.env.example`; setup guide: `docs/connectors/apify-youtube.md`).

**NEVER use WebFetch, web scraping, or a sub-agent with WebFetch for YouTube transcripts.**
**NEVER claim to have "researched" a video without the Apify transcript.**

Hooks enforce this: WebFetch on YouTube URLs is blocked, and sub-agent prompts mentioning YouTube without the Apify command are blocked.

When spawning sub-agents for YouTube work, ALWAYS include this instruction in the agent prompt:
"Use `cd {{REPO_PATH}}/automations/youtube && node transcripts.js <url>` to get the transcript. Do NOT use WebFetch."
