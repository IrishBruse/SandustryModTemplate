#!/usr/bin/env node
/**
 * Run `npm install` in each mod folder that has a `package.json`.
 */
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { discoverMods } from "../lib/mods.js";

const ROOT = join(import.meta.dirname, "..", "..");

const mods = discoverMods().filter((mod) => existsSync(join(mod.dir, "package.json")));

if (mods.length === 0) {
  console.log("mod deps: none (no mod package.json)");
  process.exit(0);
}

for (const { folder, root, dir } of mods) {
  console.log(`mod deps: npm install in ${root}/${folder}`);
  const result = spawnSync("npm", ["install"], { cwd: dir, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
