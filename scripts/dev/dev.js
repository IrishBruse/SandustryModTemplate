#!/usr/bin/env node
/**
 * Watch src/<name>/ and build each mod into the game mods folder
 * (Linux: ~/.config/sandustry/mods/<modinfo.id>;
 *  Windows: %APPDATA%/sandustry/mods/<modinfo.id>).
 * On stop (Ctrl+C, terminal close, or child exit), remove those owned mods.
 * Usage: npm run dev [-- --mod template]
 *        npm run dev:release  — watch without debug / sourcemaps
 *        npm run dev:pick  — TTY mod picker (last choice pre-selected)
 */
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { styleText } from "../lib/cli-style.js";
import { DEFAULT_MOD_ROOTS } from "../lib/mods.js";
import { removeOwnedGameMods } from "../lib/mod-path.js";
import { pickDevModArgs } from "./pick-dev-mods.js";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const raw = process.argv.slice(2);
const pick = raw.includes("--pick");
const release = raw.includes("--no-debug");
const extra = raw.filter((arg) => arg !== "--pick");
const modArgs = await pickDevModArgs(extra, { roots: DEFAULT_MOD_ROOTS, skipPicker: !pick });

console.log(
  styleText(
    ["bold", "cyan"],
    release ? "Watching src/ and mods/ (release)" : "Watching src/ and mods/",
  ),
);

const child = spawn(
  process.execPath,
  [join(ROOT, "scripts/build/esbuild.config.mjs"), "--watch", ...modArgs, ...extra],
  {
    stdio: "inherit",
    cwd: ROOT,
    windowsHide: true,
  },
);

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
