---
title: "MANDATORY: Format Google Docs with Proper Headings and Styles"
type: rule
status: active
created: 2026-06-11
---

# MANDATORY: Format Google Docs with Proper Headings and Styles

When creating ANY Google Doc with content, ALWAYS use `scripts/gdoc-markdown.js`.

## Workflow

1. Create doc: `gws docs documents create --json '{"title": "..."}'`
2. Write content as a `.md` file with standard markdown
3. Format: `cd {{REPO_PATH}} && node scripts/gdoc-markdown.js "<docId>" "<file.md>"`
4. **Move to the shared drive folder** (Media Hub `Documents/Google Docs`, IDs in `.claude/reference/media-hub-folders.json`): `gws drive files update --params '{"fileId": "<docId>", "addParents": "<google-docs-folder-id>", "removeParents": "{{MEDIA_HUB_DRIVE_ID}}", "supportsAllDrives": true}'`

NEVER leave a Google Doc in the shared drive root. Always move it to `Documents/Google Docs`.

## Markdown → Google Docs style mapping

| Markdown | Google Docs style |
|----------|------------------|
| `# Title` | TITLE (largest, bold) |
| `## Section` | HEADING_1 (bold) |
| `### Subsection` | HEADING_2 (bold) |
| `#### Item` | HEADING_3 (bold) |
| `**text**` | Bold |
| `*text*` | Italic |
| `- item` | Bullet list |
| `---` | Gray horizontal rule |

## NEVER

- NEVER use markdown tables (`| col | col |`) in content destined for Google Docs. Tables render broken and misaligned. Convert ALL tabular data to **bold-label bullet points** instead:
  - `| Item | Cost | Date |` becomes: `- **Item A:** Cost X / Date Y`
  - For comparison data, use grouped bullet lists with a bold heading per item
- NEVER manually build raw `insertText` requests without styling
- NEVER send markdown syntax as literal text to Google Docs
