#!/usr/bin/env node
/**
 * Watch src/<name>/ and build each mod into the game mods folder
 * (Linux: ~/.config/sandustry/mods/<modinfo.name>;
 *  Windows: %APPDATA%/sandustry/mods/<modinfo.name>).
 * On stop (Ctrl+C, terminal close, or child exit), remove those owned mods.
 * Usage: npm run dev [-- --mod hello-world-example]
 */
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { styleText } from "../lib/cli-style.js";
import { removeOwnedGameMods } from "../lib/mod-path.js";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const extra = process.argv.slice(2);

console.log(styleText(["bold", "cyan"], "Watching src/ mods"));

const child = spawn("node", [join(ROOT, "scripts/build/esbuild.config.mjs"), "--watch", ...extra], {
  stdio: "inherit",
  cwd: ROOT,
});

let stopping = false;
let cleaned = false;

function cleanup() {
  if (cleaned) return;
  cleaned = true;
  try {
    removeOwnedGameMods(ROOT);
  } catch (err) {
    console.error(styleText("red", "Failed to remove owned mods:"), err);
  }
}

/** @param {NodeJS.Signals} signal */
function stop(signal) {
  if (stopping) return;
  stopping = true;
  if (!child.killed) child.kill(signal);
}

child.on("exit", (code, signal) => {
  cleanup();
  if (signal) process.exit(0);
  process.exit(code ?? 0);
});

process.on("exit", cleanup);
process.on("SIGINT", () => stop("SIGINT"));
process.on("SIGTERM", () => stop("SIGTERM"));
process.on("SIGHUP", () => stop("SIGHUP"));
