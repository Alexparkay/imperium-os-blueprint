# Org proposals - proposing changes to company truth

In org mode, `context/org/` is a read-only mirror of the company's org context repo (see `context/org/README.md`). When this seat learns that org truth is wrong or missing (a new offer, a leader change, a glossary term, an approval threshold), the change is **proposed upward**, never edited into `context/org/` directly.

Single-seat installs don't use this folder: they edit `context/org/` directly.

## The convention

One file per proposal, in this folder:

```
memory/org-proposals/YYYY-MM-DD-<slug>.md
```

Example: `memory/org-proposals/2026-07-02-new-retainer-offer.md`

## Proposal format

````markdown
# Proposal: <one-line summary>

- **File:** context/org/<which file this changes>
- **Proposed by:** <seat / person>
- **Why:** <one or two lines: what happened that makes the current org truth wrong or incomplete>

## Change

```diff
- <the current line(s), copied exactly from the org file>
+ <the proposed replacement>
```

(New sections: use only `+` lines. Removals: only `-` lines.)
````

The diff-style block is the point: the org admin should be able to apply the change without asking what was meant.

## Lifecycle (v1 - honest, no network magic)

1. The seat writes the proposal file here, following the diff-style format above.
2. The proposal reaches the org admin out-of-band (this repo's normal git push backs it up; the admin is told it exists - a message, the weekly review, however the company communicates).
3. The org admin reviews and, if accepted, has the install team roll the change out to every seat's `context/org/`.
4. Every seat receives the change on its next sync. When this seat sees the change land in `context/org/`, move the proposal file into a `merged/` subfolder here (or delete it if declined - note why in the file first).

Until a proposal is merged, the fact it carries is UNCONFIRMED: cite it as "proposed, awaiting org admin" and keep answering from the current `context/org/` truth.
