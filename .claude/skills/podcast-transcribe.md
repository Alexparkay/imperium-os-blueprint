---
name: podcast-transcribe
description: "Transcribe a podcast episode in the media store into a speaker-mapped .txt file with timestamps, dropped into the same folder. Trigger phrases include 'transcribe the [guest] podcast', 'run the transcriber on [guest]', 'get me a transcript of [guest]'s podcast', 'transcribe all unprocessed podcasts'. Zero local disk writes for media. Two paths: (1) Tier 1 - quick reformat from an existing transcript JSON (~5 sec, $0); (2) Tier 2 - fresh AssemblyAI run via streamed audio extraction (~15-25 min wall-clock per episode, ~$0.15-1.00 per episode). Speaker mapping is mandatory; pass --speakers \"Name1,Name2,Name3\" ranked by speaking time most→least. OPTIONAL MODULE - requires rclone configured against the media store + ASSEMBLYAI_API_KEY."
type: skill
status: active
created: 2026-05-07
updated: 2026-06-11
---

> **Module acquisition:** the `automations/` module this skill wraps is NOT in the starter kit. It is installed by the build team during a full engagement, or built on request - say "I want the [name] module" in the chat and it goes on the build list (see docs/connectors/not-yet.md). Skills must not pretend the module exists.


# podcast-transcribe - Repeatable Podcast Transcription Pipeline

> **OPTIONAL MODULE.** Requires the `automations/podcast-transcribe/` module, rclone configured against the media store remote ({{MEDIA_STORE}}), and `ASSEMBLYAI_API_KEY` in the root `.env`.

## Trigger

The owner says any of these → invoke this skill:
- "transcribe the [guest] podcast"
- "transcribe [guest]"
- "run the transcriber on [folder]"
- "get me the transcript for [guest]"
- "transcribe all the podcasts that don't have a transcript"
- references a podcast file in `{{MEDIA_STORE}}/Podcasts/{Guest}/`

## What it produces

Single deliverable per episode, dropped at:

```
{{MEDIA_STORE}}/Podcasts/<Guest>/<Guest>.transcript.txt
{{MEDIA_STORE}}/Podcasts/<Guest>/<Guest>.transcript.json   (raw, for re-mapping)
```

TXT format (canonical, do not change without updating this skill):

```
# <Guest Name> - Full Transcript
# Recorded: <date> | Duration: H:MM:SS | Speakers: Guest, Host, Co-host
# Source: AssemblyAI <model> | Generated: <ISO datetime>

[00:00:12] **Host**: Welcome back. So, tell me about...

[00:00:48] **Guest**: All right, if we could just take three breaths together...

[00:14:30] **Co-host**: I'm more operational. So we have a company together where...
```

One blank line between speaker turns. Consecutive utterances by the same speaker are merged into a single turn. Timestamps are HH:MM:SS zero-padded.

## Architecture (two paths)

### Tier 1 - Quick reformat (existing JSON)

If the guest already has a transcript JSON from a previous pipeline run (e.g. the intro-production pipeline leaves one behind), skip AssemblyAI and just reformat to TXT.

```bash
cd automations/podcast-transcribe
node format-from-json.js --guest "<Guest Name>" --slug <guest-slug> --map "A=Guest,B=Host,C=Cohost"
# OR auto-use the speaker_mapping already inside the JSON:
node format-from-json.js --guest "<Guest Name>" --slug <guest-slug>
# OR map by speaking-time order (most → least):
node format-from-json.js --guest "<Guest Name>" --slug <guest-slug> --speakers "Guest,Host,Cohost"
```

Cost: $0. Wall-clock: ~5 sec per episode.

To ship every guest with an existing JSON in one batch:

```bash
node batch-tier1.js          # skips guests already shipped
node batch-tier1.js --force  # overwrites
```

### Tier 2 - Fresh AssemblyAI run

For guests with no existing JSON. Source is a video/audio file in their media-store folder.

**Transport logic:**
- If source ≤ 5.5 GB: hand AssemblyAI a direct-download URL from the media store. Zero local work.
- If source > 5.5 GB: rclone serve + ffmpeg HTTP Range pulls just the audio packets, transcodes to mono 16 kHz PCM, buffers in memory, posts to AssemblyAI `/upload`. Zero local disk writes.

```bash
node transcribe.js --guest "<Guest Name>" --source "<source-file>.mp4" \
  --speakers "Guest,Host"

node transcribe.js --guest "<Guest Name>" --source "<source-file>.mp4" \
  --speakers "Guest,Host,Cohost"
```

`--speakers` is **ranked by speaking time, most → least**. The pipeline auto-detects speaking-time order from the AssemblyAI output and maps positions to the names you pass.

For explicit AssemblyAI tag overrides:
```bash
node transcribe.js --guest "<Guest Name>" --source "<file>.mp4" \
  --map "A=Guest,B=Host"
```

Cost: ~$0.15 per audio-hour (AssemblyAI speech model; verify current pricing). Wall-clock per episode: 15-25 min on a slow residential connection (audio extraction is the bottleneck), 8-12 min on fiber.

Batch all known untranscribed guests in parallel:

```bash
node batch-tier2.js                 # default concurrency 4
node batch-tier2.js --concurrency 2 # if bandwidth saturates
node batch-tier2.js --only "<name>" # one guest
```

## Adding a new guest to the catalog

When a new guest is recorded:

1. Confirm the media-store folder exists at `{{MEDIA_STORE}}/Podcasts/<Guest>/` with a video/audio source file.
2. Run:
   ```bash
   node transcribe.js --guest "<Guest>" --source "<filename.mp4>" --speakers "<ranked names>"
   ```
3. The TXT lands at `{{MEDIA_STORE}}/Podcasts/<Guest>/<Guest>.transcript.txt`.
4. A notification fires automatically via the notify module.

If you anticipate running on the same guest repeatedly (e.g. multiple recording sessions), add an entry to `batch-tier2.js`'s `TIER2` array.

## Speaker mapping - when AssemblyAI is wrong

AssemblyAI diarization is roughly 90% accurate on clean audio. For wrong mappings:

1. Open the `.transcript.json` saved alongside the TXT.
2. Inspect speaker labels A/B/C and their utterance samples.
3. Re-run with explicit `--map`:
   ```bash
   node format-from-json.js --guest "<Guest>" --slug <slug> --map "A=Real,B=Names"
   ```

## What touches local disk

**Nothing.** Both paths use:
- `rclone rcat` to write the TXT/JSON straight into the media store via stdin.
- `rclone serve http` + `ffmpeg HTTP Range` to fetch only the audio bytes from the source video. ffmpeg writes to `pipe:1`, never to a file.
- AssemblyAI's response stays in memory; we serialize and rcat it.

If you see `fs.writeFileSync` or `mkdir*` in the pipeline code, that's a bug (the no-large-local-downloads rule).

## Errors and recovery

| Error | What it means | Fix |
|---|---|---|
| `length=X exceeds max_content_length` | Source too large for the URL path | Re-run with the audio-extract path (automatic for large sources) |
| `audio extraction produced 0 bytes` | ffmpeg didn't find an audio stream | Verify the source file actually has audio; try a different file from the folder |
| `language_detection cannot be performed on files with no spoken audio` | Speech model couldn't find speech | File is likely b-roll or silence; pick a different source |
| `could not resolve folder for "<Guest>"` | Folder name mismatch | Run `rclone lsd "{{MEDIA_STORE}}/Podcasts/"` and use the exact folder name |
| `rclone link failed` | Sharing not enabled or token expired | Check `rclone about <remote>:` works; token refresh may be needed |

## Cost reference

| Step | Cost |
|---|---|
| Tier 1 (existing JSON → TXT) | $0 |
| Tier 2 AssemblyAI with speaker_labels=true | ~$0.15 / hr audio |
| 60-min episode | ~$0.15 |
| 90-min episode | ~$0.23 |

## Why no VPS by default

A VPS shaves ~10 min per episode on slow connections but adds setup, API auth, SSH key management, and a moving piece. AssemblyAI's `/upload` endpoint accepts buffered audio fine even on residential bandwidth, and ffmpeg with HTTP Range fetches only the audio packets (~5-10% of source file size). Not worth the complexity at low cadence.

If episode volume jumps to 20+/week: spawn a cheap cloud droplet, install rclone + ffmpeg, run transcribe.js there (it's portable - it only needs rclone access to the media store and the AssemblyAI key).

## What would change my answer

- AssemblyAI changing the `/upload` size cap drastically downward → would force VPS extraction
- Sustained bandwidth below ~5 Mbps → audio extraction for big files becomes >1 hr each, VPS path becomes mandatory
- Diarization accuracy on multi-speaker audio dropping below ~88% → add a speaker-embedding pass before mapping

## Related files

- `automations/podcast-transcribe/transcribe.js` - Tier 2 entry
- `automations/podcast-transcribe/format-from-json.js` - Tier 1 entry
- `automations/podcast-transcribe/batch-tier1.js` / `batch-tier2.js` - batch runners
- `automations/podcast-transcribe/lib/format-txt.js` - canonical TXT format
- `automations/podcast-transcribe/lib/speaker-map.js` - A/B/C → real names

## Sub-agents

When delegating a transcription task to a sub-agent, include in the prompt:
"Run `node automations/podcast-transcribe/transcribe.js --guest "<Guest>" --source "<file>" --speakers "<ranked names>"`. Source is a video/audio file in `{{MEDIA_STORE}}/Podcasts/<Guest>/`. `--speakers` is ranked most-spoken first. The pipeline produces a `<Guest>.transcript.txt` in the same folder. Zero local disk writes."

---

## Related

- [[dropbox-transcribe]]
- [[podcast-intro-production]]
- [[guest-intel]]
