---
title: "MANDATORY: Never Download Large Files to the Owner's Local Disk"
type: rule
status: active
created: 2026-06-11
---

# MANDATORY: Never Download Large Files to the Owner's Local Disk

Local disks fill up. Downloading large cloud files locally is a hard rule violation.

## The rule

Never `rclone copy`, `gws drive files download`, `wget`, `curl -O`, or any equivalent that writes a file >500 MB to the owner's local disk from Google Drive, Dropbox, YouTube, S3, or any remote source.

## Always use streaming instead

| Need | Streaming approach |
|---|---|
| Transcribe a long recording from cloud storage | `rclone serve http` + `ffmpeg -i http://...` with HTTP Range → pipe stdout directly to the transcription API upload (no WAV on disk) |
| Process a video frame-by-frame | `rclone serve http` + ffmpeg HTTP Range → pipe to Python / Node stdin |
| Analyze a YouTube video | Apify transcript actor (no media download; see rules-import/01) |
| Read a large PDF from Drive | `rclone cat` → stdin of the parser |
| Extract audio for TTS / speech APIs | Pipe ffmpeg stdout, same as transcription |
| Read a Google Doc | `gws docs documents get` (text only, no binary) |

## What counts as "large"

Anything > 500 MB. Long recordings, raw video footage, unoptimized MP4s, archive dumps: always stream.

## If streaming really isn't possible

1. Tell the owner BEFORE downloading. State the size, destination path, and why streaming won't work.
2. Wait for explicit approval.
3. After processing, delete the local copy immediately.

## Exceptions (still require explicit confirmation)

- Small files under 500 MB are fine without confirmation
- Code repositories (git clones) are fine
- Package installs (npm, pip, bun) are fine

## When spawning sub-agents

Include in every agent prompt that touches cloud media:
"Never download files larger than 500 MB to local disk. Use `rclone serve http` + ffmpeg HTTP Range streaming, or pipe directly between tools. Fail the task before downloading."

## Why this exists

A near-full system drive breaks everything else the OS does. The fix is architectural, not manual cleanup.
