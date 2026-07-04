# Desktop Integration — how a desktop shell preinstalls and updates this OS

This spec defines the contract between this repository (the **engine**) and any desktop
application that ships it preinstalled (the **shell**). It exists so the shell team can
build the delivery pipeline without reverse-engineering the repo. Nothing in this file
is required for a normal git-clone install — `docs/START-HERE.md` covers that path.

## 1. The engine pack

A release of this repo is packaged as one platform-independent artifact:

- `engine-<version>.tgz` — the repo at a git tag, minus maintainer-local files
  (`scrub-blacklist.local.json`, `.context/`, anything gitignored).
- `manifest.json` — `{ engineVersion, minAppVersion, tarballSha256, files: [{path, sha256, class}], removed: [] }`.

The per-file `class` field is the load-bearing part. Two classes:

| Class | Paths | Update behavior |
|---|---|---|
| `engine` | `.claude/skills/`, `.claude/rules/`, `.claude/rules-import/`, `.claude/hooks/`, `.claude/reference/`, `scripts/`, `packs/` (pack sources), `brain/`, `automations/`, `dashboard/README.md`, `docs/` system files | Replaceable by the updater when the on-disk hash matches the shipped hash |
| `seed` | `CLAUDE.md`, `context/**`, `memory/**`, `Home.md`, `content-pipeline/**`, `packs/installed.json`, `.claude/settings.json`, anything not listed in the manifest | Never touched by the updater |

The `<!-- ENGINE-BOUNDARY -->` markers in `.claude/CLAUDE.md` and the
"Engine vs seed files" section of `docs/ARCHITECTURE.md` document the same split from
the repo side. Three merge-point exceptions (files that are engine-shipped but
seat-modified) are listed there: the privacy-rule list, routing-index rows appended by
pack installs, and pack skills copied into `.claude/skills/`. The updater must merge
these, never clobber them.

## 2. Packaging pipeline (shell side)

1. A tag on this repo triggers CI that builds `engine-<version>.tgz` + `manifest.json`
   and publishes both as release assets on the distribution repo.
2. The shell's installer **bakes** the current engine pack into the app bundle
   (e.g. `resources/app/engine.tgz`) so first run works fully offline.
3. The shell's product configuration pins `{version, sha256, urlTemplate}` for the
   engine pack, mirroring how it pins its agent-SDK downloads.

Rules: tar entries must be POSIX-pathed, no symlinks, no absolute or `..` paths.
The extractor must enforce the same (path-traversal guard).

## 3. Provisioning flow (first run)

1. The shell seeds the workspace by extracting the baked engine pack into the user's
   workspace directory (idempotent: skip-if-exists per file), then writes the applied
   manifest to `.claude/engine-manifest.json` — the baseline for update-time
   modified-file detection.
2. A user stub (`user.json` equivalent: name, role, company, provisionedBy) is written
   by the shell; if an access-code / identity service is available, its validated
   payload may also pre-seed `memory/onboarding-state.md` — marking identity and
   business-context phases complete so the first conversation resumes at Connections.
   This is the done-for-you pre-seed pattern; the onboarding skill's resume logic
   handles it with zero extra code.
3. After sign-in, the shell auto-sends the canonical trigger phrase in the chat
   surface: **"I've just installed this, let's start"** (one-shot, flagged). The
   `start-onboarding` skill takes it from there, including org-detect.

## 4. Update protocol

- The updater fetches `manifest.json` for the target version (ideally via the vendor's
  web endpoint fronting the release asset, enabling per-org pinning and staged rollout).
- Per `engine`-class file: if on-disk hash equals the OLD manifest hash → replace.
  If the file was locally modified → keep the user's file, place the new version in
  `.claude/updates/<version>/<path>`, and notify. The shipped `system-update` skill
  (shell-side responsibility, spec here) lets the agent merge conversationally.
  The mechanical updater never guesses.
- `removed[]` entries are deleted only if unmodified. New `seed`-class files are
  written only if absent. Replaced files are backed up locally.
- After update: run `node scripts/generate-registry.js` and `node scripts/os-lint.js`;
  surface a lint regression to the user as a notification, not a blocker.

## 5. Multi-seat / org wiring

- Shared company truth = the company workspace backend built into Imperium OS
  (one Supabase project per company; see the fork's imperium/company-backend/).
  The install team pre-loads `context/org/` on every seat; team contributions
  arrive read-only in `context/team/` automatically.
- Structured operational data = the Brain (`brain/README.md`), one per company,
  on the company's own database account.
- Seat identity for the org repo: install-team-provisioned accounts are acceptable
  at white-glove scale; proxying org-repo traffic through a vendor service with a
  server-held token is the scale path.

## 6. Telemetry touchpoints (optional)

If the shell captures conversation/usage telemetry, stamp events with
`companyId`, `seatId`, and `engineVersion` resource attributes, and emit:
onboarding phase transitions (from `memory/onboarding-state.md` writes),
pack install/uninstall events, and engine-update outcomes (applied version,
conflict count). These joins are what make fleet-wide "what do users ask that the
engine can't do yet" analysis possible.

## 7. Verification matrix (per shell release)

- Fresh-machine online first run: install → seeded workspace → sign-in →
  pre-seeded resume-at-Connections → one connector verified live.
- Offline first launch: workspace seeds and onboarding starts with no network.
- Update-conflict test: modify one engine file, update; the modified file is kept,
  the new version is quarantined, `memory/` is byte-identical.
- Two-seat org test: second seat detects org context in Phase 0 and skips to the
  seat interview; nothing from seat one's voice/privacy files is readable on seat two.
- Proxy/SSL-inspection variant of the first-run chain.

## 8. Known risks the shell must own

1. Agent-SDK redistribution/licensing and per-seat auth terms — verify against the
   SDK vendor's current terms before any paid install.
2. Release assets as a CDN behind corporate NAT (rate limits) — the baked pack removes
   the first-run dependency; front updates with a vendor endpoint.
3. Update clobbering — the manifest + quarantine protocol above exists for this;
   agents edit engine files as a matter of course, so drift is guaranteed, not rare.
4. Unsigned macOS builds are a non-starter for business users — notarize before the
   first non-Windows seat.
