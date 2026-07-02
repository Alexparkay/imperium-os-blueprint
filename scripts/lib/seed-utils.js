// Shared seed-integrity helpers for the single-seed-source convention
// (brain/seed/MANIFEST.md): every sample row lives in brain/seed/seed.sql
// with a hard-coded UUID, and every consumer (the worker's fixtures, any
// cockpit mock) mirrors those exact rows. Deterministic ids make the mirror
// checkable: extract the UUID set from each side and compare.
//
// Consumers of this helper:
//   scripts/package-check.js  (check 4 - the hard pre-release gate)
//   scripts/os-lint.js        (check 7d - the advisory day-to-day sweep)

const UUID_RE = /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi;

/** All UUID literals in a text, lowercased, as a Set. */
function extractUuids(text) {
  return new Set((String(text || '').match(UUID_RE) || []).map((u) => u.toLowerCase()));
}

/**
 * Compare the canonical seed's UUID set against a consumer's.
 * @returns {{missing: string[], extra: string[], matched: number}}
 *   missing = in seed but absent from the consumer
 *   extra   = in the consumer but absent from the seed (invented data)
 */
function diffUuidSets(seedSet, consumerSet) {
  const missing = [...seedSet].filter((u) => !consumerSet.has(u)).sort();
  const extra = [...consumerSet].filter((u) => !seedSet.has(u)).sort();
  const matched = [...seedSet].filter((u) => consumerSet.has(u)).length;
  return { missing, extra, matched };
}

module.exports = { UUID_RE, extractUuids, diffUuidSets };
