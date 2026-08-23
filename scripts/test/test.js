#!/usr/bin/env node
/**
 * Run TypeScript tests under src/ with the Node test runner (Node 24 strips types).
 */
import { globSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const files = globSync("src/**/*.test.ts", { cwd: ROOT }).sort();

if (files.length === 0) {
  console.error("No tests found (src/**/*.test.ts).");
  process.exit(1);
}

const result = spawnSync(process.execPath, ["--test", ...files.map((file) => join(ROOT, file))], {
  cwd: ROOT,
  stdio: "inherit",
});
process.exit(result.status ?? 1);
