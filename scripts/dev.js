#!/usr/bin/env node
/**
 * Watch src/ and build the mod into ~/.config/sandustry/mods/Example Mod.
 * Usage: npm run dev
 */
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ensureModDir, linkRepoDistToModOutput, MOD_DIR } from "./mod-path.js";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

ensureModDir();
linkRepoDistToModOutput(ROOT);
process.env.MOD_OUT_DIR = MOD_DIR;
process.env.MOD_DEBUG = "1";

console.log(`Watching src/ -> ${MOD_DIR}/main.js`);

const child = spawn("node", [join(ROOT, "esbuild.config.mjs"), "--watch"], {
  stdio: "inherit",
  env: process.env,
  cwd: ROOT,
});

child.on("exit", (code) => process.exit(code ?? 0));
