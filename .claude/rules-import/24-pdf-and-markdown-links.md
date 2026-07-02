---
title: "MANDATORY: Always Provide Clickable Links to PDFs and Markdown Files"
type: rule
status: active
created: 2026-06-11
---

# MANDATORY: Always Provide Clickable Links to PDFs and Markdown Files

When presenting the owner with ANY file produced or referenced in a response, format the file path so they can open it without scrolling through Explorer/Finder.

## Format by file type

### Markdown (.md)

Always render as a relative-path markdown link from repo root:

```
[brief-2026-06.md](memory/business/brief-2026-06.md)
```

Click in VSCode → opens in the editor pane.

### PDF (.pdf)

Always provide BOTH:

1. **Relative-path markdown link** (opens in VSCode if a PDF viewer is available):

   ```
   [brief-2026-06.pdf](memory/business/brief-2026-06.pdf)
   ```

2. **Absolute `file://` URL on its own line** (paste into a browser to view, then download if needed):

   ```
   file:///{{REPO_PATH}}/memory/business/brief-2026-06.pdf
   ```

The browser URL is the fallback because IDE PDF rendering is inconsistent. The browser one always works.

### All other files (audio, video, images, JSON, CSVs)

Relative-path markdown link only. If the owner needs to open it externally, they can right-click the link → Reveal in Explorer.

## Path formatting rules

- **Forward slashes always**, even on Windows
- **Markdown links:** path relative to repo root (e.g. `memory/business/foo.pdf`, NOT an absolute path)
- **`file://` URLs:** absolute path, lowercase drive letter on Windows, three slashes after `file:`
- **Never wrap a `file://` URL in backticks**; code formatting can break click-to-paste in some terminals. Plain text on its own line.
- **Never use HTML tags**; markdown link syntax only.

## When to apply

- Every time you save a PDF and tell the owner about it
- Every time you reference an existing PDF in a response
- Every time you create or edit a markdown file the owner might want to open
- Every status report that lists files
- Every "I shipped X" summary

## Exception

Files mentioned only in passing as background context (not asking the owner to open them) don't need the dual format. Use judgment: if the owner would plausibly open this file in the next 30 seconds, apply the rule.

## Sub-agents

When spawning sub-agents that produce files, instruct them in the prompt: "When reporting file paths back, follow rule 24: markdown link for `.md` files, BOTH a markdown link AND a `file://` URL for `.pdf` files."

## Why this exists

Without this, the owner has to hunt through hundreds of files in Explorer to open something the OS just made. The `file://` URL turns a 30-second hunt into a copy-paste.
