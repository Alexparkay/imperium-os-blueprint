---
title: "MANDATORY: Auto-Save Generated Media to the Media Hub"
type: rule
status: active
created: 2026-06-11
---

# MANDATORY: Auto-Save All Generated Media to the Media Hub

Every asset generated or created during a session MUST be uploaded to the owner's **Media Hub** shared drive (created during onboarding Phase 4; requires the Google Workspace connector).

## What gets saved

| Asset type | Drive folder | Examples |
|-----------|-------------|---------|
| AI-generated images | `Generated/Images` | Portraits, product shots, thumbnails |
| AI-generated videos | `Generated/Videos` | Promo clips, animated assets |
| NotebookLM artifacts | `Generated/NotebookLM` | Podcasts, audio overviews, study guides |
| Audio files | `Audio` | Voice clones, TTS output, transcription audio |
| Google Docs | `Documents/Google Docs` | Strategy docs, research reports, briefs |
| Google Sheets | `Documents/Spreadsheets` | Tracking sheets, data analysis, calendars |
| Social post visuals | `Social` | Final post-ready images, carousels |
| Content assets | `Content Assets` | Thumbnails, blog images, newsletter graphics |
| Owner-provided photos | `Personal Photos` | Real photos the owner uploads for content use |

## How to save

Use the `gws drive` CLI with `supportsAllDrives: true`.

**Shared Drive ID:** `{{MEDIA_HUB_DRIVE_ID}}` (filled during onboarding Phase 4; folder IDs are recorded in `.claude/reference/media-hub-folders.json`, which the onboarding skill creates).

## Rules

1. **Auto-save without being asked.** If you generated it, upload it.
2. **Use the shared drive, not personal Drive.** Always pass `supportsAllDrives: true`.
3. **Name files descriptively.** Not "image.png"; use "01-hero-shot-product-v2.png".
4. **Report the upload.** After uploading, confirm with the Drive file name and folder.
5. **Google Docs/Sheets go to Documents/.** Create them directly in the shared drive.

## If the Media Hub is not configured yet

Skip the upload, tell the owner the asset is local-only, and note that onboarding Phase 4 sets up the Media Hub.
