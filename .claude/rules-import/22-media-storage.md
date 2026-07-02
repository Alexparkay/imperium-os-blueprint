---
title: "MANDATORY: The Media Store Is The Canonical Home For Large Media"
type: rule
status: active
created: 2026-06-11
---

# MANDATORY: {{MEDIA_STORE}} Is The Canonical Home For Large Media

All large files (videos, raw footage, podcast audio, image stacks, design assets) live in the owner's media store ({{MEDIA_STORE}}, chosen during onboarding Phase 4: typically Dropbox or Google Drive; guide: `docs/connectors/dropbox-rclone.md`). Google Workspace is for docs/sheets/slides only.

## Storage split (HARD RULE)

| Asset type | Lives in | Access |
|---|---|---|
| Videos, raw camera footage, podcast audio, B-roll, large media | **{{MEDIA_STORE}}** | rclone / MCP / local sync set to online-only |
| Google Docs, Sheets, Slides | **Google Workspace** | gws CLI per rules-import/08 |
| AI-generated assets | **Media Hub shared drive** (`{{MEDIA_HUB_DRIVE_ID}}`) | gws CLI per rules-import/07 |
| Code, configs, content drafts (markdown) | **This git repo** | local git |

If unsure, default to {{MEDIA_STORE}} for any file > 50 MB.

## Lookup priority

When the owner references a media file or folder ("the [guest] podcast", "the footage from [date]", "the brand assets"), look in the canonical media-store paths documented in `context/org/glossary.md` (filled during onboarding). Verify a path exists with `rclone lsd` before telling the owner it does or doesn't.

## Local file system access

If the media store syncs locally:

- **Set the folder to online-only** (smart sync). Files appear in Explorer/Finder, take ~0 disk space until opened.
- **Never make large videos "available offline"** in the sync client. Rule 21 still applies; large local downloads are banned.
- For reading file content: stream via rclone or use the provider's web preview. Don't double-click large videos.

## External collaborator handoff (editors, freelancers)

Two supported patterns:

- **File request links** (Dropbox File Requests or equivalent): per-project upload link, no account needed for the collaborator, revoke after handoff.
- **Cloud-to-cloud import**: when a collaborator shares from another cloud, copy cloud-to-cloud (rclone on a temporary VPS or server-side copy), never through the local disk.

**Collaborator permissions:** WRITE access to working/output folders only; READ-ONLY on raw source folders (irreplaceable source is never editable by collaborators); NO ACCESS outside their assigned project folder.

## Naming conventions

- Project folders: short kebab or `YYYY-MM-DD_<descriptor>` for shoots
- Versioned drafts: `<project>_v1.mp4`, `<project>_v2.mp4`
- Final cut: `<project>_FINAL.mp4` (no version suffix, only one file with FINAL)

## Per-project lifecycle

```
01_Raw/         → source files (read-only after ingest)
02_Working/     → collaborator working space (versioned drafts)
03_Final/       → approved deliverable (owner sign-off required)
04_Distribution/→ thumbnails, social cuts, derivatives
```

When a project closes, move the whole folder to an archive area. Keeps the active area fast for daily use.

## Backup awareness

Sync is NOT backup. Version history on most providers is limited (typically 30-180 days depending on plan; verify in the provider's admin). For genuine backup against catastrophic loss, a separate cold-storage strategy is needed.

## Sub-agents

When spawning sub-agents that need media, include in their prompt:
"Media files live in {{MEDIA_STORE}}. Use rclone or the provider's MCP to access. Never download large files to the local disk."
