---
title: "MANDATORY: Excalidraw + Artifact Browser Links"
type: rule
status: active
created: 2026-06-11
---

# MANDATORY: Excalidraw + Artifact Browser Links

Whenever you deliver an Excalidraw diagram, OR create any contract / PDF / invoice / document artifact, you MUST give the owner BOTH the file path AND a browser-viewable route. Every time, without being asked. This sharpens rule 24 for the two cases the owner most often needs to open externally.

## Excalidraw diagrams: a CLICKABLE URL is MANDATORY, every time

**Hard rule: every Excalidraw diagram MUST be delivered with a clickable `https://excalidraw.com/#json=...` URL that opens the rendered diagram in the browser on one click. No exceptions, never wait to be asked.** A `file://` path or "import it yourself" instruction is NOT enough; a `.excalidraw` file opened in a browser shows raw JSON, not the diagram. The clickable URL is the headline deliverable.

### How to produce the clickable URL

Push the diagram's serialized Excalidraw JSON through the **Excalidraw MCP** `export_to_excalidraw` tool (requires the Excalidraw MCP, see `docs/connectors/mcp-servers.md`). It returns a `https://excalidraw.com/#json=<id>,<key>` link that renders the diagram instantly in any browser. That returned URL is what you give the owner, on its own line, at the top of the delivery.

### For large / script-generated diagrams (the round-trip trap)

`export_to_excalidraw` needs the JSON in the tool call, which means it must fit in context. A big script-generated `.excalidraw` file (200+ elements / >100 KB) cannot be round-tripped through one tool call. Do NOT burn turns trying to read-and-retype a giant file. Instead:

- **Author a clean condensed one-screen version inline** (directly in the `export_to_excalidraw` call), push it, and give the owner that URL. Keep the full detailed `.excalidraw` file on disk as the source of truth.
- Or build the diagram through the MCP from the start (inline) so the URL is native and the file is the export, not the source.
- Keep inline diagrams compact: use **bound text** (rect `boundElements` + text `containerId`) so one box = 2 elements, round coordinates to ints, drop default fields.

### Also give the file links (so it's editable / version-controlled)

Alongside the clickable URL, still give:

1. **Markdown file link** (relative path from repo root): one-click open in VSCode.
2. **Absolute `file://` path** on its own line: locates the raw `.excalidraw` file for `excalidraw.com → Open` if the owner wants to edit the full version.

Order of delivery: **clickable `#json=` URL first**, then the file links.

## Contracts, PDFs, invoices, documents: always give the browser path

For every contract, PDF, invoice, or document artifact created or referenced for action, give BOTH:

1. **Markdown file link** (relative path from repo root).
2. **Absolute `file://` URL** on its own line, so the owner can paste it into a browser to view and download.

Never deliver one of these with only a filename, only a chat mention, or only a relative link. The `file://` browser path is mandatory for anything the owner would plausibly open or sign.

## Format rules (inherit from rule 24)

- Forward slashes always, even on Windows.
- Markdown links: path relative to repo root.
- `file://` URLs: absolute, lowercase drive letter on Windows, three slashes.
- **Never wrap a `file://` URL in backticks**; plain text on its own line so click-to-copy works.
- Never use HTML anchor tags; markdown link syntax only.

## When to apply

- Every Excalidraw diagram, every time.
- Every contract / PDF / invoice / generated document the owner would plausibly open in the next 30 seconds.

## When NOT to apply

- Files mentioned only as passing background context that the owner is not being asked to open.

## Sub-agents

When a sub-agent produces an Excalidraw diagram or a PDF / contract / invoice, instruct it in the prompt: "Report back the markdown file link, the absolute `file://` path, and, for Excalidraw, push it through the `export_to_excalidraw` MCP tool and return the clickable `https://excalidraw.com/#json=...` URL it gives back, per rule 30."
