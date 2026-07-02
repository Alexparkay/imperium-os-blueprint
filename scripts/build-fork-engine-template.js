#!/usr/bin/env node
// Generates the desktop fork's engineTemplate.ts from this blueprint.
//
// The fork (a VS Code fork) preinstalls this blueprint as the user's workspace on first run.
// Its seeding code reads an ENGINE_TEMPLATE array of { path, content } string constants; this
// script embeds every git-tracked blueprint file into that array so the fork ships a full,
// offline-capable workspace without cloning anything.
//
//   node scripts/build-fork-engine-template.js [forkEngineTemplatePath]
//
// Default target: ../vscode/src/vs/platform/imperium/common/engineTemplate.ts (sibling checkout).
// Re-run after any blueprint change, then commit the regenerated file in the fork.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const blueprintDir = path.resolve(__dirname, '..');
const defaultTarget = path.resolve(blueprintDir, '..', 'vscode', 'src', 'vs', 'platform', 'imperium', 'common', 'engineTemplate.ts');
const outFile = path.resolve(process.argv[2] || defaultTarget);

const sha = execFileSync('git', ['-C', blueprintDir, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim();
const tracked = execFileSync('git', ['-C', blueprintDir, 'ls-files'], { encoding: 'utf8' })
	.split('\n')
	.map(l => l.trim())
	.filter(Boolean)
	.sort();

// The per-seat identity file is provisioned by the fork (its access-code flow fills it), not the
// blueprint. It stays a local stub so offline first-run works, and its path is what the fork's
// imperiumIdentityApply rewrites. It must be the first entry and an ENGINE_TEMPLATE member
// (imperiumIdentityApply derives RESERVED_ENGINE_PATHS from this array).
const IDENTITY_STUB = `{
	"name": "Founder",
	"role": "Head of Department",
	"company": "Your Company",
	"companyId": "your-company",
	"employeeId": "founder",
	"department": "Operations",
	"position": "Head of Department",
	"provisionedBy": "imperium-os"
}
`;

const files = [{ path: 'imperium-user.json', content: IDENTITY_STUB }];
const binary = [];
let bytes = IDENTITY_STUB.length;

for (const rel of tracked) {
	const buf = fs.readFileSync(path.join(blueprintDir, rel));
	if (buf.includes(0)) { binary.push(rel); continue; } // binary: seeder writes strings only
	files.push({ path: rel, content: buf.toString('utf8') });
	bytes += buf.length;
}

if (binary.length) {
	console.error(`[fork-seed] refusing to generate: ${binary.length} binary file(s) tracked but not embeddable:`);
	binary.forEach(b => console.error(`  - ${b}`));
	process.exit(1);
}

const header = `/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// GENERATED FILE - DO NOT EDIT BY HAND.
// Source: Imperium OS Blueprint @ ${sha} (${files.length - 1} tracked files).
// Regenerate from a blueprint checkout: node scripts/build-fork-engine-template.js
//
// This is the full preinstalled workspace laid down on first run. The per-seat identity file
// (imperium-user.json) is a stub the access-code flow overwrites; everything else is the
// blueprint engine + seed content.

/**
 * A single file laid down into a freshly provisioned Imperium OS workspace on first run.
 * Paths use POSIX separators relative to the workspace root.
 */
export interface IEngineTemplateFile {
	readonly path: string;
	readonly content: string;
}

/**
 * The path of the per-user identity file. Seeded as a local stub so the first-run flow is fully
 * exercisable offline; overwritten by imperiumIdentityApply once the access code resolves.
 */
export const IMPERIUM_USER_CONFIG_FILE = 'imperium-user.json';

/**
 * The Imperium OS Blueprint workspace, embedded file-by-file. imperiumProvisioning seeds each
 * entry idempotently (skip-if-exists); imperiumIdentityApply treats every path here as a
 * reserved engine path the identity payload may not overwrite.
 */
export const ENGINE_TEMPLATE: readonly IEngineTemplateFile[] = [
`;

const body = files
	.map(f => `\t{ path: ${JSON.stringify(f.path)}, content: ${JSON.stringify(f.content)} },`)
	.join('\n');

const out = `${header}${body}\n];\n`;

// Self-check: the array literal we just emitted must round-trip to the same entries.
const literal = out.slice(out.indexOf('= [') + 2, out.lastIndexOf('];') + 1);
let parsed;
try {
	// eslint-disable-next-line no-eval
	parsed = eval(literal);
} catch (err) {
	console.error('[fork-seed] generated array failed to parse:', err.message);
	process.exit(1);
}
if (!Array.isArray(parsed) || parsed.length !== files.length) {
	console.error(`[fork-seed] self-check mismatch: parsed ${parsed && parsed.length} vs expected ${files.length}`);
	process.exit(1);
}
for (let i = 0; i < files.length; i++) {
	if (parsed[i].path !== files[i].path || parsed[i].content !== files[i].content) {
		console.error(`[fork-seed] round-trip mismatch at index ${i} (${files[i].path})`);
		process.exit(1);
	}
}

if (!fs.existsSync(path.dirname(outFile))) {
	console.error(`[fork-seed] target directory does not exist: ${path.dirname(outFile)}`);
	console.error('[fork-seed] pass the fork engineTemplate.ts path explicitly as the first argument.');
	process.exit(1);
}

fs.writeFileSync(outFile, out, 'utf8');
console.log(`[fork-seed] wrote ${files.length} files (${(bytes / 1024).toFixed(0)} KB source) from blueprint @ ${sha}`);
console.log(`[fork-seed] -> ${outFile} (${(out.length / 1024).toFixed(0)} KB)`);
