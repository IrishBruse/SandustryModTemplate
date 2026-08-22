#!/usr/bin/env node
/**
 * Run `npm install` in each `src/<name>/` folder that has a `package.json`.
 */
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { discoverModFolders } from "./mods.js";

const ROOT = join(import.meta.dirname, "..", "..");
const SRC_DIR = join(ROOT, "src");

const folders = discoverModFolders().filter((folder) =>
  existsSync(join(SRC_DIR, folder, "package.json")),
);

if (folders.length === 0) {
  console.log("mod deps: none (no src/<name>/package.json)");
  process.exit(0);
}

for (const folder of folders) {
  const dir = join(SRC_DIR, folder);
  console.log(`mod deps: npm install in src/${folder}`);
  const result = spawnSync("npm", ["install"], { cwd: dir, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
