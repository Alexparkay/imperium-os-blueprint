---
name: intro-forensics
description: "Forensic frame-by-frame analysis of podcast intros/hooks. Deconstructs what makes a hook retain viewers, extracts a replication formula, ranks clippable soundbites, produces an editor-ready brief + full breakdown with screenshots. Single-episode OR batch top-N viral analysis for any YouTube channel. Triggers when the owner says 'analyze [host]'s hook / intro / top N videos', 'break down [podcast] intro', 'why does [channel]'s hook work', 'extract hook formula from [channel]', 'study [X] podcast's opening', or any intent to reverse-engineer a podcast intro's structure. Outputs: editor-brief.md (5-min read), breakdown.md (frame-by-frame), hook-formula.md (cross-episode synthesis). OPTIONAL MODULE - requires the intro-forensics automation (yt-dlp + ffmpeg + AssemblyAI + Gemini API keys)."
type: skill
status: active
created: 2026-04-20
updated: 2026-06-11
---

> **Module acquisition:** the `automations/` module this skill wraps is NOT in the starter kit. It is installed by the build team during a full engagement, or built on request - say "I want the [name] module" in the chat and it goes on the build list (see docs/connectors/not-yet.md). Skills must not pretend the module exists.


# Intro Forensics Skill

Forensic-level teardown of podcast intros. Combines yt-dlp + ffmpeg + AssemblyAI (diarization) + a fast vision model (per-frame visual) + a strong reasoning model (narrative + synthesis).

> **OPTIONAL MODULE.** Requires the `automations/intro-forensics/` module plus `GEMINI_API_KEY` and `ASSEMBLYAI_API_KEY` in the root `.env`, and yt-dlp + ffmpeg installed. If the module isn't installed, the methodology below still describes what to analyze manually.

## When to trigger

- "Analyze [host]'s hook" / "analyze [host]'s intro"
- "Why does [channel]'s opening work"
- "Break down the intro of [episode]"
- "Extract hook formula from [channel]"
- "Study [X]'s top N viral videos"
- "What makes [podcast] intros good"
- Any YouTube URL with intent to analyze the intro, NOT transcribe the whole episode

## When NOT to trigger

- Full-episode transcription → use `automations/youtube/transcripts.js` (YouTube-Apify rule)
- Creator channel strategy → use the creator deep-dive workflow
- Single-shot YouTube summary → use `content-pipeline`

## Location

`automations/intro-forensics/`

## Commands

### Single episode

```bash
cd automations/intro-forensics
node analyze.js "<youtube-url>" \
  --duration 120 \
  --fps 2 \
  --label "<short-slug>" \
  --title "<human-readable title>" \
  --speaker-a "<Host name>" \
  --speaker-b "<Guest name>"
```

Produces three files in `output/<label>/`:
- `editor-brief.md` - ~100-line digestible brief for the editor (verdict, hook in 30s, one-liner blueprint, top 5 patterns, frame cheat sheet, pacing, typography, color palette, do/don't checklist)
- `breakdown.md` - full frame-by-frame (3000-5000 lines) with inline screenshots, word-level speech alignment, per-frame visual description
- `data.json` - raw data for downstream synthesis

### Batch top-N viral from a channel

```bash
cd automations/intro-forensics
node batch.js "<channel-url>" \
  --top 5 \
  --duration 120 \
  --host "<Host name>" \
  --channel-name "<Channel name>" \
  --channel-label "<channel-slug>"
```

Discovers the top-N most-viewed long-form videos (filters out Shorts with `--min-duration 600`), runs analyze on each, then writes:
- `output/<channel-label>/hook-formula.md` - cross-episode synthesis: constants vs variables by guest, universal typography, pacing profile, blueprint for a new guest
- `output/<channel-label>/synthesis.json` - raw synthesis data
- `output/<channel-label>/manifest.json` - which videos were analyzed
- Per-episode reports in sibling dirs

### Regenerate brief from existing data (free, no re-analysis)

```bash
node brief.js <label>
```

### Regenerate breakdown with updated merge template

```bash
node render.js <label>
```

## How Claude should orchestrate

When the owner says "analyze [host]'s top 10 viral podcasts":

1. Determine the channel URL. If the owner only gave a name, use `yt-dlp --flat-playlist "https://www.youtube.com/@<handle>/videos"` to confirm, OR web search to find the channel handle.
2. Run `node batch.js "<channel-url>" --top N --host "<Host>" --channel-name "<Channel>" --channel-label "<slug>"`
3. After completion, summarize: the formula from `hook-formula.md`, the aesthetic signature, and the top 2-3 patterns to steal for the owner's podcast.
4. Link to the three output file types (brief, formula, breakdown).

For a SINGLE episode:
1. Parse the YouTube URL from the request
2. Run `node analyze.js "<url>" --duration 120 --label "<slug>" --speaker-a "<Host>" --speaker-b "<Guest>"`
3. Deliver the `editor-brief.md` first (what the owner/editor wants), mention `breakdown.md` as the deep dive.

## Cost model (reference snapshot - verify current API pricing)

| Mode | Cost | Time |
|---|---|---|
| Single episode (120s analyzed) | ~$0.10 | ~3 min |
| Batch top 5 + synthesis | ~$0.55 | ~15 min |
| Batch top 10 + synthesis | ~$1.10 | ~30 min |

## Known constraints

- Analyzes the first N seconds of each video (default 120s). The hook lives in that window.
- Voice-only diarization can mis-cluster when intros splice host voiceover with guest soundbites. Face-override (visual on-camera analysis) resolves this - surfaces in the "Speaker Resolution" section.
- Channel discovery skips Shorts by filtering `--min-duration 600` (10 min+). Adjust if a channel has shorter long-form content.
- Requires: yt-dlp + ffmpeg installed, GEMINI_API_KEY + ASSEMBLYAI_API_KEY in the root `.env`.

## What to hand to an editor

1. `editor-brief.md` - read first. It's the "why + how to clone" in 5 minutes
2. `hook-formula.md` (if batch mode) - the channel-wide formula
3. `breakdown.md` - reference for specific frames + exact typography + on-screen text timings
4. Inline screenshots in `frames/` - every 0.5s + every scene cut

## Example invocations

- "Analyze [channel]'s top 10 viral podcasts and extract the hook formula"
- "Break down the intro of [show]'s [guest] episode"
- "Why does [host]'s hook on [episode] work - build me a replication blueprint"
- "Study [host]'s intro style across their top 5 episodes"
- "Compare [creator]'s top 3 content intros - what's the formula"

## Cross-references

- Blueprint Archive: editors can combine outputs from this skill with the hook bank
- YouTube-Apify rule: still use the Apify pipeline for full-episode transcripts; this skill is intro-only
- Media-hub rule: editor briefs saved to the media store if shared with the team

---

## Related

- [[podcast-intro-production]]
- [[guest-intel]]
- [[blueprint-archive]]
