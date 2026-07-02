#!/usr/bin/env node
// Package check - the pre-release / pre-delivery gate.
// Where os-lint.js is the advisory day-to-day sweep, THIS is the hard gate:
// run it before tagging a template release, and run it with --client before
// any client package leaves the building. Exit 1 on any FAIL.
//
//   node scripts/package-check.js            template-release mode
//   node scripts/package-check.js --client   client-package mode (stricter)
//
// Six checks, built from real packaging mistakes:
//   1. Scrub blacklist   - zero maintainer-local blacklist tokens in tracked files
//   2. Donor branding    - no module README/pack shipped under another product's name
//   3. Domain leak       - no hardcoded external domains in code/config/html
//                          (a client build's image-domain allowlist once leaked
//                          into another client's package this way)
//   4. Seed integrity    - one sample dataset, mirrored exactly (brain/seed/MANIFEST.md)
//   5. Badge contract    - non-live data is always labelled (SEED DATA badge /
//                          the worker's "source" field)
//   6. Placeholders      - onboarding tokens inventoried; documented-only in
//                          template mode; in --client mode zero survivors
//                          EXCEPT the deferred-ok allowlist: the table between
//                          <!-- deferred-ok:start --> and <!-- deferred-ok:end -->
//                          in docs/ONBOARDING-FLOW.md is the single source of
//                          truth for tokens whose feature is legitimately
//                          dormant (skipped connectors, uninstalled packs).
//                          Each row = backticked token patterns (trailing *
//                          matches a prefix family) + backticked path prefixes
//                          where survivors are allowed. A survivor matching a
//                          pattern INSIDE an allowed path passes (reported as
//                          info); everything else fails.
//
// The scrub blacklist (scrub-blacklist.local.json) is maintainer-local and
// gitignored: the MECHANISM ships, the list does not. Reserved keys in that
// file are not treated as token arrays: "_comment" (docstring), "notes"
// (prose guidance), "safe_contexts" (phrases that neutralise a token match
// occurring INSIDE them, e.g. a famous public figure sharing a first name
// with a blacklisted contact).

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const { extractUuids, diffUuidSets } = require('./lib/seed-utils');

const ROOT = path.resolve(__dirname, '..');
const CLIENT_MODE = process.argv.includes('--client');
const MODE = CLIENT_MODE ? 'client-package' : 'template-release';
const today = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; })();

// ---------- shared state ----------
const failures = [];   // { check, msg }
const warnings = [];   // { check, msg }
const infos = [];      // { check, msg }
function fail(check, msg) { failures.push({ check, msg }); }
function warn(check, msg) { warnings.push({ check, msg }); }
function info(check, msg) { infos.push({ check, msg }); }

function sh(cmd) {
  try { return execSync(cmd, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['pipe', 'pipe', 'pipe'] }).trim(); }
  catch (e) { return (e.stdout || '').trim(); }
}
function read(p) { try { return fs.readFileSync(p, 'utf8'); } catch { return ''; } }
function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

// Tracked files only: untracked local files (like the blacklist itself) never ship.
const TEXT_EXT = new Set(['.md', '.js', '.mjs', '.cjs', '.ts', '.tsx', '.json', '.sql', '.sh', '.ps1', '.bat', '.html', '.htm', '.yml', '.yaml', '.toml', '.txt', '.svg', '.css', '.env', '.example', '.gitignore', '.gitattributes']);
const trackedAll = sh('git ls-files').split('\n').filter(Boolean);
const tracked = trackedAll.filter((f) => {
  const base = path.basename(f);
  return TEXT_EXT.has(path.extname(base).toLowerCase()) || base.startsWith('.') || base === '.env.example';
});
const fileCache = new Map();
function contentOf(rel) {
  if (!fileCache.has(rel)) fileCache.set(rel, read(path.join(ROOT, rel)));
  return fileCache.get(rel);
}

// Product identity, read from the repo's own front page - never hardcoded,
// so a re-skinned client package checks against ITS name, not the donor's.
const readmeH1 = (contentOf('README.md').match(/^#\s+(.+)$/m) || [])[1] || '';
const PRODUCT_NAME = readmeH1.trim();

const results = []; // { n, name, status: 'PASS'|'FAIL'|'SKIP', detail }

console.log(`PACKAGE CHECK - ${MODE} mode - ${today}`);
console.log(`product: ${PRODUCT_NAME || '(no README H1 found)'} · tracked text files: ${tracked.length}`);
console.log('');

// ============================================================
// Check 1 - Scrub blacklist
// ============================================================
{
  const CHECK = '1. scrub blacklist';
  const blPath = path.join(ROOT, 'scrub-blacklist.local.json');
  if (!fs.existsSync(blPath)) {
    if (CLIENT_MODE) {
      fail(CHECK, 'scrub-blacklist.local.json is MISSING - a client package must be scrub-verified. Obtain the maintainer blacklist before delivery.');
      results.push({ n: 1, name: 'Scrub blacklist', status: 'FAIL', detail: 'blacklist file required in --client mode' });
    } else {
      console.log('  ============================================================');
      console.log('  NOTICE: scrub check SKIPPED - scrub-blacklist.local.json not');
      console.log('  found at the repo root. The mechanism ships with the repo;');
      console.log('  the list itself is maintainer-local and gitignored. On the');
      console.log('  maintainer machine this check MUST run before any release.');
      console.log('  ============================================================');
      results.push({ n: 1, name: 'Scrub blacklist', status: 'SKIP', detail: 'blacklist file absent (maintainer-local)' });
    }
  } else {
    let bl = {};
    try { bl = JSON.parse(read(blPath)); }
    catch { fail(CHECK, 'scrub-blacklist.local.json is not valid JSON'); }

    const RESERVED_KEYS = new Set(['_comment', 'notes', 'safe_contexts']);
    const tokens = [];
    for (const [key, val] of Object.entries(bl)) {
      if (RESERVED_KEYS.has(key) || key.startsWith('_')) continue;
      if (Array.isArray(val)) for (const t of val) if (typeof t === 'string' && t.trim()) tokens.push(t.trim());
    }
    const safeContexts = Array.isArray(bl.safe_contexts) ? bl.safe_contexts.filter((s) => typeof s === 'string' && s.trim()) : [];

    // Documented exception (the blacklist's own _comment): the product name and
    // the "Built by ..." attribution may appear in README.md, LICENSE.md, and
    // docs front matter. Operationalised as: tokens that are part of the product
    // identity (share the product's brand word) are allowed in those locations.
    const brandWord = (PRODUCT_NAME.split(/\s+/)[0] || '').toLowerCase();
    const EXCEPTION_FILES = new Set(['README.md', 'LICENSE.md']);
    function inDocsFrontMatter(rel, lineIdx) {
      if (!rel.startsWith('docs/') || !rel.endsWith('.md')) return false;
      const lines = contentOf(rel).split('\n');
      if (lines[0] !== '---') return false;
      const end = lines.indexOf('---', 1);
      return end > 0 && lineIdx > 0 && lineIdx < end;
    }

    // word-boundary matching via lookarounds (avoids "typo"-style substring hits)
    const tokenRes = tokens.map((t) => ({ t, re: new RegExp(`(?<![A-Za-z0-9_])${esc(t)}(?![A-Za-z0-9_])`, 'gi') }));
    let hitCount = 0;
    for (const rel of tracked) {
      const lines = contentOf(rel).split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        for (const { t, re } of tokenRes) {
          re.lastIndex = 0;
          let m;
          while ((m = re.exec(line)) !== null) {
            // safe-context suppression: match lies inside a sanctioned phrase
            let safe = false;
            for (const ctx of safeContexts) {
              let from = 0, idx;
              const lower = line.toLowerCase(), ctxLower = ctx.toLowerCase();
              while ((idx = lower.indexOf(ctxLower, from)) !== -1) {
                if (m.index >= idx && m.index + m[0].length <= idx + ctx.length) { safe = true; break; }
                from = idx + 1;
              }
              if (safe) break;
            }
            if (safe) continue;
            // documented product-identity exception
            if (brandWord && t.toLowerCase().startsWith(brandWord)
              && (EXCEPTION_FILES.has(rel) || inDocsFrontMatter(rel, i))) continue;
            hitCount++;
            fail(CHECK, `${rel}:${i + 1} - blacklisted token "${t}"`);
          }
        }
      }
    }
    if (hitCount === 0 && !failures.some((f) => f.check === CHECK)) {
      info(CHECK, `${tokens.length} tokens checked against ${tracked.length} tracked files - zero hits`);
      results.push({ n: 1, name: 'Scrub blacklist', status: 'PASS', detail: `${tokens.length} tokens, 0 hits` });
    } else {
      results.push({ n: 1, name: 'Scrub blacklist', status: 'FAIL', detail: `${hitCount} hit(s)` });
    }
  }
}

// ============================================================
// Check 2 - Donor/module branding
// ============================================================
{
  const CHECK = '2. donor branding';
  let bad = 0;

  // 2a. Any `product:` front-matter naming a different product, anywhere.
  for (const rel of tracked.filter((f) => f.endsWith('.md'))) {
    const fm = contentOf(rel).match(/^---\n([\s\S]*?)\n---/);
    if (!fm) continue;
    const pm = fm[1].match(/^product:\s*["']?(.+?)["']?\s*$/m);
    if (pm && pm[1].trim() !== PRODUCT_NAME && !pm[1].includes('{{')) {
      bad++;
      fail(CHECK, `${rel} - front matter says "product: ${pm[1].trim()}" but this product is "${PRODUCT_NAME}"`);
    }
  }

  // 2b. Module surfaces must be this product or product-neutral: first heading
  // must not carry another product's brand ("<Brand> OS/CRM/Suite/..." where
  // <Brand> is not ours and not a generic article), and (when the blacklist is
  // loaded) check 1 already catches donor company names everywhere.
  const moduleFiles = tracked.filter((f) =>
    /^automations\/[^/]+\/README\.md$/.test(f) ||
    /^packs\/[^/]+\/pack\.md$/.test(f) ||
    f === 'brain/README.md' || f === 'dashboard/README.md');
  const GENERIC_LEAD = new Set(['the', 'this', 'your', 'a', 'an', 'our', 'company']);
  const brandedRe = /\b([A-Z][A-Za-z0-9]+)[ -](OS|CRM|Suite|Cloud|HQ|Cockpit|Portal)\b/g;
  for (const rel of moduleFiles) {
    const body = contentOf(rel).replace(/^---\n[\s\S]*?\n---/, '');
    const heading = (body.match(/^#{1,3}\s+(.+)$/m) || [])[1] || '';
    let m;
    brandedRe.lastIndex = 0;
    while ((m = brandedRe.exec(heading)) !== null) {
      const lead = m[1];
      if (GENERIC_LEAD.has(lead.toLowerCase())) continue;
      if (PRODUCT_NAME.toLowerCase().includes(lead.toLowerCase())) continue;
      if (heading.includes('{{')) continue; // placeholder headings are fine pre-onboarding
      bad++;
      fail(CHECK, `${rel} - first heading "${heading.trim()}" appears to name a different product ("${m[0]}")`);
    }
  }

  if (bad === 0) {
    info(CHECK, `${moduleFiles.length} module surfaces + all front matter checked - all this-product or product-neutral`);
    results.push({ n: 2, name: 'Donor/module branding', status: 'PASS', detail: `${moduleFiles.length} module surfaces clean` });
  } else {
    results.push({ n: 2, name: 'Donor/module branding', status: 'FAIL', detail: `${bad} branding leak(s)` });
  }
}

// ============================================================
// Check 3 - External-domain leak (code/config/html surface)
// ============================================================
{
  const CHECK = '3. domain leak';
  // Vendor/docs/infra domains this template legitimately talks to. A domain
  // matches if it equals an entry or is a subdomain of one. Anything else in
  // CODE/CONFIG/HTML is treated as a leak (a prior client's image allowlist
  // shipping inside the next client's build is the incident behind this).
  const DOMAIN_ALLOWLIST = [
    'github.com', 'githubusercontent.com',          // repo + backup rails
    'anthropic.com', 'claude.ai', 'claude.com',     // the runtime + its docs
    'supabase.com',                                  // the Brain
    'google.com', 'googleapis.com',                  // gws CLI + Google docs
    'apify.com', 'youtube.com', 'youtu.be',          // YouTube research rail
    'telegram.org',                                  // notify rail
    'npmjs.org', 'npmjs.com',                        // package registry
    'w3.org',                                        // SVG/HTML namespaces
    'shields.io',                                    // README badges
    'localhost', '127.0.0.1', '0.0.0.0', 'example.com', // local/dev/RFC-reserved
  ];
  const CODE_EXT = new Set(['.js', '.mjs', '.cjs', '.ts', '.tsx', '.json', '.sql', '.sh', '.ps1', '.bat', '.html', '.htm', '.yml', '.yaml', '.toml', '.css', '.svg']);
  const surface = tracked.filter((f) => {
    if (path.basename(f) === 'package-lock.json') return false; // machine-generated
    return CODE_EXT.has(path.extname(f).toLowerCase()) || path.basename(f) === '.env.example';
  });
  const urlRe = /https?:\/\/([A-Za-z0-9][A-Za-z0-9.-]*)/g;
  const allowed = (host) => DOMAIN_ALLOWLIST.some((d) => host === d || host.endsWith('.' + d));
  let leaks = 0;
  for (const rel of surface) {
    const lines = contentOf(rel).split('\n');
    for (let i = 0; i < lines.length; i++) {
      let m;
      urlRe.lastIndex = 0;
      while ((m = urlRe.exec(lines[i])) !== null) {
        const host = m[1].toLowerCase().replace(/\.$/, '');
        if (!allowed(host)) { leaks++; fail(CHECK, `${rel}:${i + 1} - hardcoded external domain "${host}"`); }
      }
    }
  }
  if (leaks === 0) {
    info(CHECK, `${surface.length} code/config/html files scanned - only allowlisted domains found`);
    results.push({ n: 3, name: 'External-domain leak', status: 'PASS', detail: `${surface.length} files, 0 leaks` });
  } else {
    results.push({ n: 3, name: 'External-domain leak', status: 'FAIL', detail: `${leaks} leak(s)` });
  }
}

// ============================================================
// Check 4 - Seed single-source integrity
// ============================================================
{
  const CHECK = '4. seed integrity';
  let bad = 0;
  const seedRel = 'brain/seed/seed.sql';
  const fixturesRel = 'automations/worker/lib/fixtures.js';
  const manifestRel = 'brain/seed/MANIFEST.md';

  const seedText = contentOf(seedRel);
  const fixturesText = contentOf(fixturesRel);
  const manifestText = contentOf(manifestRel);

  if (!seedText) { bad++; fail(CHECK, `${seedRel} missing or empty`); }
  if (!fixturesText) { bad++; fail(CHECK, `${fixturesRel} missing or empty`); }
  if (!manifestText) { bad++; fail(CHECK, `${manifestRel} missing - the single-seed-source convention requires it`); }

  if (seedText && fixturesText) {
    const seedSet = extractUuids(seedText);
    const fixSet = extractUuids(fixturesText);
    const { missing, extra, matched } = diffUuidSets(seedSet, fixSet);
    if (missing.length) { bad++; fail(CHECK, `fixtures missing ${missing.length} seed UUID(s): ${missing.join(', ')}`); }
    if (extra.length) { bad++; fail(CHECK, `fixtures contain ${extra.length} UUID(s) NOT in seed.sql (invented data): ${extra.join(', ')}`); }
    if (!missing.length && !extra.length) info(CHECK, `fixtures mirror seed.sql exactly (${matched} UUIDs)`);
  }

  if (manifestText) {
    // Manifest-listed file paths must exist on disk (skip <placeholder> patterns).
    const listed = [...manifestText.matchAll(/`([^`\s]+)`/g)].map((m) => m[1])
      .filter((p) => /^[\w.-]+(\/[\w.-]+)+\.\w+$/.test(p) && !p.includes('<'));
    for (const p of listed) {
      if (!fs.existsSync(path.join(ROOT, p))) { bad++; fail(CHECK, `${manifestRel} lists \`${p}\` but it does not exist on disk`); }
    }
    // Every plausible sample-dataset file on disk must be in the manifest.
    // Plausible = name says fixture/seed/mock, extension can carry rows,
    // content actually holds row-like data (UUID literals / INSERT INTO /
    // JSON id fields) - docs that merely mention the words don't count.
    const DATA_EXT = new Set(['.sql', '.json', '.js', '.mjs', '.cjs', '.ts']);
    const candidates = tracked.filter((f) =>
      /(fixture|seed|mock)/i.test(path.basename(f)) &&
      DATA_EXT.has(path.extname(f).toLowerCase()) &&
      !f.startsWith('brain/seed/') &&
      f !== 'scripts/lib/seed-utils.js' && !f.startsWith('scripts/') && // checkers/utilities, not datasets
      !f.includes('node_modules'));
    for (const rel of candidates) {
      const text = contentOf(rel);
      const rowLike = extractUuids(text).size > 0 || /insert\s+into/i.test(text) || /"id"\s*:\s*"/.test(text);
      if (!rowLike) continue;
      if (!manifestText.includes(rel)) { bad++; fail(CHECK, `${rel} looks like a sample dataset but is not listed in ${manifestRel} - one dataset, one source`); }
    }
  }

  results.push(bad === 0
    ? { n: 4, name: 'Seed single-source integrity', status: 'PASS', detail: 'fixtures mirror seed; manifest complete' }
    : { n: 4, name: 'Seed single-source integrity', status: 'FAIL', detail: `${bad} issue(s)` });
}

// ============================================================
// Check 5 - SEED DATA badge contract
// ============================================================
{
  const CHECK = '5. badge contract';
  let bad = 0;

  // 5a. The cockpit contract must require the badge.
  if (!/SEED[ -]DATA/i.test(contentOf('dashboard/README.md'))) {
    bad++; fail(CHECK, 'dashboard/README.md no longer requires the "SEED DATA" badge - the cockpit contract must keep it');
  }

  // 5b. Any code that switches onto mock/fixture data must have badge-or-label
  // evidence in its module. For the worker, the API-level label counts: hub.js
  // must stamp "source" into its JSON responses.
  const flagRe = /DATA_SOURCE\s*[=:]|source\s*[:=]\s*['"](fixtures|mock)['"]/;
  const codeFiles = tracked.filter((f) => /\.(js|mjs|cjs|ts|tsx)$/.test(f) && !f.startsWith('scripts/') && !f.includes('node_modules'));
  const flagFiles = codeFiles.filter((f) => flagRe.test(contentOf(f)));
  const evidenceRe = /SEED[ -]DATA|res\.json\(\s*\{[^]{0,300}?\bsource\b/;
  for (const rel of flagFiles) {
    const moduleDir = rel.split('/').slice(0, 2).join('/'); // e.g. automations/worker
    const moduleHasEvidence = tracked.some((f) => f.startsWith(moduleDir + '/') && evidenceRe.test(contentOf(f)));
    if (!moduleHasEvidence) {
      bad++; fail(CHECK, `${rel} switches onto fixture/mock data but module ${moduleDir}/ shows no badge/label evidence (SEED DATA badge or a "source" field in responses)`);
    }
  }

  // 5c. The worker specifically: hub.js must stamp the source field.
  const hub = contentOf('automations/worker/hub.js');
  if (hub && !(/res\.json\(/.test(hub) && /[{,]\s*source\s*[,}:]/.test(hub))) {
    bad++; fail(CHECK, 'automations/worker/hub.js serves JSON but does not stamp the "source" field - fixture data would be silent');
  }
  if (hub && bad === 0) info(CHECK, `hub.js stamps "source" in responses; ${flagFiles.length} fixture-flag file(s) all covered by badge/label evidence`);

  results.push(bad === 0
    ? { n: 5, name: 'SEED DATA badge contract', status: 'PASS', detail: 'contract present; worker stamps source' }
    : { n: 5, name: 'SEED DATA badge contract', status: 'FAIL', detail: `${bad} issue(s)` });
}

// ============================================================
// Check 6 - Placeholder inventory
// ============================================================
{
  const CHECK = '6. placeholders';
  // Onboarding placeholders are double-braced UPPERCASE tokens; runtime
  // template vars (lowercase, e.g. a mail-merge firstName) are not counted.
  const tokenRe = /\{\{([A-Z][A-Z0-9_]*\*?)\}\}/g;
  const inventory = new Map(); // token -> [{file, line}]
  for (const rel of tracked) {
    const lines = contentOf(rel).split('\n');
    for (let i = 0; i < lines.length; i++) {
      let m;
      tokenRe.lastIndex = 0;
      while ((m = tokenRe.exec(lines[i])) !== null) {
        if (!inventory.has(m[1])) inventory.set(m[1], []);
        inventory.get(m[1]).push({ file: rel, line: i + 1 });
      }
    }
  }

  // Documented lifecycle: the ONBOARDING-FLOW placeholder table, plus tokens
  // used by identity.md / the context templates. Starred wildcard tokens
  // (FOLDER_ and friends) document a prefix family.
  const docSources = ['docs/ONBOARDING-FLOW.md', ...tracked.filter((f) => f.startsWith('context/'))];
  const documented = new Set();
  const documentedPrefixes = [];
  for (const src of docSources) {
    let m;
    tokenRe.lastIndex = 0;
    const text = contentOf(src);
    while ((m = tokenRe.exec(text)) !== null) {
      if (m[1].endsWith('*')) documentedPrefixes.push(m[1].slice(0, -1));
      else documented.add(m[1]);
    }
  }
  const isDocumented = (t) => documented.has(t) || t.endsWith('*') || documentedPrefixes.some((p) => t.startsWith(p));

  const sorted = [...inventory.keys()].sort();
  console.log(`  placeholder inventory (${sorted.length} distinct tokens):`);
  for (const t of sorted) {
    const occ = inventory.get(t);
    console.log(`    {{${t}}}  x${occ.length}${isDocumented(t) ? '' : '   [not in documented lifecycle]'}`);
  }

  if (CLIENT_MODE) {
    // Zero survivors outside the files that DOCUMENT the tokens, with one
    // principled exception: the deferred-ok allowlist in ONBOARDING-FLOW.md
    // (tokens whose feature is dormant until a connector/pack step runs).
    const EXEMPT = new Set(['docs/ONBOARDING-FLOW.md']);
    const EXEMPT_PREFIXES = ['.claude/skills/start-onboarding/']; // the whole skill dir (dispatcher + phases/ + roles/) documents the token system

    // Parse the deferred-ok allowlist (single source of truth, see header).
    const deferredOk = []; // { exact: Set, prefixes: [], paths: [] }
    {
      const flow = contentOf('docs/ONBOARDING-FLOW.md');
      const block = (flow.match(/<!--\s*deferred-ok:start\s*-->([\s\S]*?)<!--\s*deferred-ok:end\s*-->/) || [])[1] || '';
      for (const line of block.split('\n')) {
        if (!line.trim().startsWith('|') || /^\|\s*-+/.test(line.trim()) || /Token pattern/i.test(line)) continue;
        const cells = line.split('|').map((c) => c.trim());
        if (cells.length < 3) continue;
        const tokenPatterns = [...cells[1].matchAll(/`\{\{([A-Z][A-Z0-9_]*\*?)\}\}`/g)].map((m) => m[1]);
        const pathPrefixes = [...cells[2].matchAll(/`([^`]+)`/g)].map((m) => m[1]);
        if (!tokenPatterns.length || !pathPrefixes.length) continue;
        deferredOk.push({
          exact: new Set(tokenPatterns.filter((t) => !t.endsWith('*'))),
          prefixes: tokenPatterns.filter((t) => t.endsWith('*')).map((t) => t.slice(0, -1)),
          paths: pathPrefixes,
        });
      }
      if (!deferredOk.length) warn(CHECK, 'deferred-ok allowlist not found in docs/ONBOARDING-FLOW.md (markers deferred-ok:start/end) - --client is running with zero allowances');
    }
    const isDeferredOk = (t, file) => deferredOk.some((row) =>
      (row.exact.has(t) || row.prefixes.some((p) => t.startsWith(p))) &&
      row.paths.some((p) => file === p || file.startsWith(p)));

    let survivors = 0;
    let allowed = 0;
    for (const [t, occs] of inventory) {
      for (const o of occs) {
        if (EXEMPT.has(o.file) || EXEMPT_PREFIXES.some((p) => o.file.startsWith(p))) continue;
        if (isDeferredOk(t, o.file)) { allowed++; continue; }
        survivors++;
        fail(CHECK, `${o.file}:${o.line} - unreplaced placeholder {{${t}}} (client packages ship zero survivors outside the deferred-ok allowlist)`);
      }
    }
    if (allowed) info(CHECK, `${allowed} dormant-token occurrence(s) allowed by the deferred-ok allowlist (docs/ONBOARDING-FLOW.md)`);
    results.push(survivors === 0
      ? { n: 6, name: 'Placeholders (client: zero survivors)', status: 'PASS', detail: `no unreplaced tokens outside onboarding docs (${allowed} deferred-ok allowed)` }
      : { n: 6, name: 'Placeholders (client: zero survivors)', status: 'FAIL', detail: `${survivors} survivor(s), ${allowed} deferred-ok allowed` });
  } else {
    // Template mode: tokens are SUPPOSED to exist. Inventory is informational;
    // tokens outside the documented lifecycle warn (lenient by design).
    const unknown = sorted.filter((t) => !isDocumented(t));
    for (const t of unknown) {
      const first = inventory.get(t)[0];
      warn(CHECK, `{{${t}}} (first seen ${first.file}:${first.line}) is not in the documented placeholder lifecycle (docs/ONBOARDING-FLOW.md / context templates) - document it or fold it into an existing token`);
    }
    results.push({ n: 6, name: 'Placeholders (template: inventory)', status: 'PASS', detail: `${sorted.length} tokens, ${unknown.length} undocumented (WARN only)` });
  }
}

// ============================================================
// Report
// ============================================================
console.log('');
for (const r of results) {
  console.log(`[${r.n}/6] ${r.status.padEnd(4)} ${r.name} - ${r.detail}`);
}
console.log('');
if (failures.length) {
  console.log(`FAILURES (${failures.length}):`);
  for (const f of failures) console.log(`  FAIL [${f.check}] ${f.msg}`);
  console.log('');
}
if (warnings.length) {
  console.log(`WARNINGS (${warnings.length}):`);
  for (const w of warnings) console.log(`  WARN [${w.check}] ${w.msg}`);
  console.log('');
}
for (const i of infos) console.log(`  info [${i.check}] ${i.msg}`);
console.log('');

// Report file (gitignored .context/, same convention as os-lint)
try {
  const outDir = path.join(ROOT, '.context', 'package-check');
  fs.mkdirSync(outDir, { recursive: true });
  const lines = [`# Package check - ${MODE} - ${today}`, '',
    ...results.map((r) => `- [${r.status}] ${r.name} - ${r.detail}`), '',
    `## Failures (${failures.length})`, ...failures.map((f) => `- [${f.check}] ${f.msg}`), '',
    `## Warnings (${warnings.length})`, ...warnings.map((w) => `- [${w.check}] ${w.msg}`), ''];
  fs.writeFileSync(path.join(outDir, `${today}-${CLIENT_MODE ? 'client' : 'template'}.md`), lines.join('\n'), 'utf8');
} catch { /* report file is best-effort */ }

const verdict = failures.length === 0;
console.log(`PACKAGE CHECK ${verdict ? 'PASS' : 'FAIL'} - ${MODE} mode - ${failures.length} failure(s), ${warnings.length} warning(s)`);
if (!verdict && CLIENT_MODE) console.log('A client package with failures above DOES NOT SHIP.');
process.exit(verdict ? 0 : 1);
