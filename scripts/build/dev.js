#!/usr/bin/env node
/**
 * Watch src/<name>/ and build each mod into the game mods folder
 * (Linux: ~/.config/sandustry/mods/<modinfo.name>;
 *  Windows: %APPDATA%/sandustry/mods/<modinfo.name>).
 * Usage: npm run dev [-- --mod example]
 */
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const extra = process.argv.slice(2);

console.log("Watching src/ mods");

const child = spawn("node", [join(ROOT, "scripts/build/esbuild.config.mjs"), "--watch", ...extra], {
  stdio: "inherit",
  cwd: ROOT,
});

child.on("exit", (code) => process.exit(code ?? 0));
