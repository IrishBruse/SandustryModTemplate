#!/usr/bin/env node
/**
 * Generate Docsify Markdown API reference from vendored modkit/types declarations.
 * Usage: npm run docs:api
 *
 * TypeDoc runs from scripts/docs/ with TypeScript 5.9 (TypeDoc does not support TS 7 yet).
 */
import { spawnSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const DOCS_SCRIPTS = join(ROOT, "scripts/docs");
const OUT = join(ROOT, "docs/api");
const TYPEDOC = join(DOCS_SCRIPTS, "node_modules/typedoc/bin/typedoc");
const CONFIG = join(DOCS_SCRIPTS, "typedoc.json");

function ensureDocsDeps() {
  if (existsSync(TYPEDOC)) return;
  console.log("Installing docs generator deps in scripts/docs/ …");
  const install = spawnSync("npm", ["install", "--no-audit", "--no-fund"], {
    cwd: DOCS_SCRIPTS,
    stdio: "inherit",
  });
  if (install.status !== 0) process.exit(install.status ?? 1);
}

ensureDocsDeps();

if (existsSync(OUT)) {
  rmSync(OUT, { recursive: true, force: true });
}

const result = spawnSync(process.execPath, [TYPEDOC, "--options", CONFIG], {
  stdio: "inherit",
  cwd: DOCS_SCRIPTS,
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log("Wrote API docs to docs/api/");
