# YouTube (Apify transcripts)

The OS's only sanctioned way to read YouTube content. Any YouTube URL gets its transcript pulled through the Apify actor; never WebFetch, never page scraping (scraped pages give partial, unreliable text and break silently).

## Setup

1. Create an Apify account (apify.com, free tier works for light use)
2. Copy your API token from Settings → Integrations
3. Add to the repo root `.env`: `APIFY_API_TOKEN=your-token`
4. `npm install` in this folder (installs axios + dotenv)

Covered in detail by `docs/connectors/apify-youtube.md` during onboarding Phase 4.

## Usage

Single video (prints transcript to stdout):

```bash
node transcripts.js "https://www.youtube.com/watch?v=VIDEO_ID"
```

Bulk fetch (saves one markdown file per video + an index):

```bash
node bulk-chase.js <output-dir> <url1> <url2> ...
```

## Note for sub-agents

Sub-agents start blank. When delegating any YouTube task, include this command in the agent prompt so it never falls back to web scraping.
