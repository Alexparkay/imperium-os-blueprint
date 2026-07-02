---
name: dropbox-transcribe
description: "On-demand transcription of any media-store folder of videos. Triggers on 'transcribe [date] daily footage', 'transcribe daily footage for [day]', 'transcribe folder [path]', 'mass transcribe daily footage', 'transcribe all daily footage', 'get transcripts of [folder]'. Wraps automations/dropbox-transcribe/ which streams videos via rclone serve + ffmpeg → AssemblyAI → markdown transcripts back to the media store. ZERO local disk writes (lint-enforced). Per-video .transcript.md + folder-level _DAY-FULL.md (chronological + filtered) + _INDEX.json. Idempotent (file_id-based). Multi-folder mode via run-all.js auto-discovers leaf folders containing videos. Cost ~$0.21/hr audio. OPTIONAL MODULE - requires rclone configured against the media store + ASSEMBLYAI_API_KEY."
metadata:
  type: skill
  status: active
  created: 2026-05-06
  updated: 2026-06-11
  audience: the owner
---

> **Module acquisition:** the `automations/` module this skill wraps is NOT in the starter kit. It is installed by the build team during a full engagement, or built on request - say "I want the [name] module" in the chat and it goes on the build list (see docs/connectors/not-yet.md). Skills must not pretend the module exists.


# dropbox-transcribe - On-Demand Media-Store Folder Transcription

> **What this is.** A pipeline + framework for transcribing any media-store folder of videos. Streams the source video without ever touching local disk, sends audio to AssemblyAI, writes timestamped markdown back alongside each source file. Idempotent re-runs skip already-done files via cloud `file_id` match.
>
> **Why this exists.** Owners who shoot regular footage (daily vlogs, b-roll, talks) accumulate large folders the cloud store can't search. This pipeline closes that gap with zero footprint on the local disk (lint-enforced) and writes transcripts as searchable text right next to the videos.
>
> **OPTIONAL MODULE.** Requires `automations/dropbox-transcribe/`, rclone configured against {{MEDIA_STORE}}, and `ASSEMBLYAI_API_KEY` in the root `.env`. Works with Dropbox or any rclone-supported remote.

---

## When to Trigger

Activate when the owner says any of:

- "Transcribe [date]" / "transcribe [folder name]"
- "Transcribe daily footage for [day]"
- "Mass transcribe daily footage" / "transcribe all daily footage"
- "Get transcripts of [folder]"
- Any request to extract spoken text from videos in a media-store folder

Skip when:

- The transcript already exists with matching `file_id` frontmatter (the idempotency check handles this automatically - re-run is safe and fast)
- The trigger is a YouTube URL → use `automations/youtube/transcripts.js` instead (YouTube-Apify rule)
- Live audio recording → use the one-off transcribe tool instead

---

## Execution mode: pick before running

### Mode A: VPS (default for any "mass" run - laptop sleeps)

When the folder has >5 videos, OR the owner says "go run it" / "do it in the background" / "I'm closing my laptop", use the VPS launcher:

```bash
bash automations/dropbox-transcribe/scripts/run-on-vps.sh "<media-store path>"
```

What happens:
1. Provisions a cloud droplet (small, ~$0.05/hr)
2. Installs node + ffmpeg + rclone (~2 min one-time per droplet)
3. Copies the dropbox-transcribe code + rclone.conf + .env
4. Detaches a `screen` session that runs `watchdog.js` then `verify-pass.js`
5. The local script exits - the owner's laptop can sleep
6. The VPS sends a notification on completion + self-destroys via the provider API

Cost: $0.10-0.50 per run typical.
Wall time: 5-10x faster than local (data-center bandwidth vs residential downlink).

**Prerequisites:** the cloud provider API token in the root `.env`, SSH key (auto-generated if missing).

### Mode B: Local single-folder (tiny test runs)

```bash
node automations/dropbox-transcribe/run.js \
  --folder "<media-store path>" \
  --concurrency 5
```

### Mode C: Local mass run with watchdog (laptop must stay on)

```bash
cd automations/dropbox-transcribe
node watchdog.js --parent "<media-store parent path>" --concurrency 5
node verify-pass.js --parent "<media-store parent path>"
```

`watchdog.js` auto-restarts if the log goes idle >8 min. Up to 8 restarts. Idempotency makes restarts free.

### Flags (passed through to run.js)

- `--dry-run` - list candidates + estimated cost, no AssemblyAI calls
- `--only <name.MP4>` - process exactly one video (smoke test)
- `--force` - re-transcribe even if `.transcript.md` already exists (use when upgrading the engine)
- `--exclude "B-roll,Photos,..."` - comma-separated subfolder names to skip (default: B-roll variants, Photos, Podcast)
- `--concurrency N` - parallel uploads (default 3, max 5 on the AssemblyAI free tier)
- `--min-duration N` - skip clips shorter than N seconds (default 30, set 0 to disable)

### Per-folder outputs (written back to the media store)

```
{folder}/
├── _DAY-FULL.md                ← TOC + chronological body of substantial clips (≥20 words)
├── _INDEX.json                 ← machine-readable for fast lookups
├── {video1}.transcript.md      ← per-video, with frontmatter (file_id, duration, word count)
├── {video2}.transcript.md
└── ...
```

### Frontmatter per transcript

```yaml
source_video: C2049.MP4
source_path: <media-store path>/C2049.MP4
file_id: id:xxxxxxxxxxxx
date: YYYY-MM-DD
duration_sec: 8
duration_human: "0:08"
word_count: 19
transcribed_at: <ISO datetime>
model: <assemblyai model>
source_modified_at: <ISO datetime>
```

---

## Multi-Folder (Mass) Mode

For "transcribe all daily footage" requests, use `run-all.js`. It auto-discovers every leaf folder that contains videos, then runs `run.js` against each one sequentially.

```bash
node automations/dropbox-transcribe/run-all.js \
  --parent "<media-store parent path>" \
  [--max-depth 3]      # default 3 (raise for deeply nested videographer folders)
  [--dry-run]          # discovery + cost estimate, no transcription
  [--skip-empty]       # default true - skip folders with 0 videos
  [--concurrency 3]    # passed to run.js
```

Each leaf folder gets its own `_DAY-FULL.md` + `_INDEX.json`. Per-folder idempotency means already-done folders process near-instantly.

---

## Architecture (zero local disk, lint-enforced)

```
Media-store folder
       │
       │  rclone serve http  (HTTP Range, fetches only what's needed)
       ▼
       ffmpeg  (-vn -ac 1 -ar 16000 pcm_s16le → stdout)
       │
       │  Buffer in Node memory (~32 KB/sec audio = max ~100 MB for 1 hr)
       ▼
       AssemblyAI POST /upload  (single body, NOT chunked - chunked 502s on long streams)
       │
       │  audio_url
       ▼
       AssemblyAI POST /transcript
       │  punctuate, format_text; speaker_labels off for raw footage
       │
       │  poll every 5s (typically completes in 30 sec to 5 min)
       ▼
       transcript JSON  (utterances, words, full_text)
       │
       │  format markdown in memory  (frontmatter + timestamps + chronological)
       ▼
       rclone rcat <remote>:.../{stem}.transcript.md  (stdin pipe)
```

### Hard rules enforced

- **No large local downloads:** lint-enforced. `npm run lint:no-disk` bans `fs.writeFileSync`, `fs.createWriteStream`, `fs.appendFile*`, `fs.mkdir*` in `lib/` + `run.js`.
- **Media-store-canonical:** all I/O via rclone or the store's MCP.
- **Clickable file links:** transcripts use markdown links to source files.

---

## Engine Choice

Default engine: **AssemblyAI's current top speech model** (at module-build time: Universal-3 Pro, ~$0.21/hr, 5.6% real-world WER, ~30% fewer hallucinations than Whisper Large-v3, with automatic fallback to the previous model for unsupported languages).

For SOTA accuracy on critical content (podcast episodes, recorded talks), check the current speech-to-text leaderboard (artificialanalysis.ai/speech-to-text) and benchmark the leader before a big run. Engine choice is a config swap, not an architecture change.

---

## Idempotency

Re-running on the same folder is **safe and free**:

- Pre-flight reads each candidate's existing `.transcript.md` from the same path
- Parses frontmatter, checks `file_id`
- If it matches the source's cloud file_id → skips
- `--force` overrides (use when upgrading the engine)

Kill mid-run? Just re-run; finished files skip, only the interrupted one re-attempts.

---

## Cost & Wall-Clock (reference, verified on a 60 GB / 40-clip pilot folder)

| Source size | Audio | Wall-clock @ ~100 Mbps down |
|---|---|---|
| 100 MB clip | ~30 sec | ~30-60 sec |
| 1 GB clip | ~5 min | ~2-4 min |
| 6 GB clip | ~8 min | ~9 min |
| 60 GB folder, 40 mixed clips | ~80 min audio | ~80 min wall-clock, ~$0.21 |

The bottleneck is the downlink fetching source video from the cloud CDN. AssemblyAI itself processes at ~0.008x real-time. The VPS mode removes the bandwidth bottleneck.

---

## Operational hardening (already built into the module)

- **30-second duration filter** - ffprobe duration check + size shortcut for small files. Stops b-roll being transcribed.
- **`watchdog.js`** - auto-recovery wrapper. Use this instead of bare `run-all.js` for any production run.
- **`verify-pass.js`** - final audit script. Run after every mass run.
- **`run-on-vps.sh`** - fire-and-forget VPS launcher for mass runs.
- **`_INDEX.json` includes a `skipped[]` array with names** - verify-pass can reconcile per-file.
- **Model fallback array** - won't break on engine deprecation.
- **`NO_AUDIO` error code** - silent or audio-less clips don't kill the run.
- **`Podcast` excluded by default** - the podcast pipelines handle those separately.

---

## Related

- [[podcast-transcribe]]
- [[podcast-intro-production]]
- [[media-hub]]

## Triage heuristic: fake "edited" duplicates

When auditing a media folder, two files with the SAME byte size and same/near mtime where one is named like an output ("Edited", "Final", "Master") are usually a byte-copy of the raw, not an edit. Flag as `suspected duplicate (byte-copy)` and verify with a hash before counting it as finished work or deleting anything. Real installs have found 80+ GB of these masquerading as finished edits.
