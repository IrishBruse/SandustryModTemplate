#!/usr/bin/env node
/**
 * Watch src/ and build the mod into ~/.config/sandustry/mods/<modinfo.name>.
 * Usage: npm run dev
 */
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ensureModDir, linkRepoDistToModOutput, MOD_DIR } from "../sandustry/mod-path.js";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

ensureModDir();
linkRepoDistToModOutput(ROOT);

console.log(`Watching src/ -> ${MOD_DIR}/main.js`);

const child = spawn("node", [join(ROOT, "scripts/build/esbuild.config.mjs"), "--watch"], {
  stdio: "inherit",
  cwd: ROOT,
});

child.on("exit", (code) => process.exit(code ?? 0));
