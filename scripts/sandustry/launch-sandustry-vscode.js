#!/usr/bin/env node
/**
 * Build the mod with source maps, stop any running game, launch Sandustry with debug ports.
 * Usage: VS Code launch.json only (sandustry:vscode-background task).
 */
import { spawnSync } from "node:child_process";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  DEFAULT_RENDERER_DEBUG_PORT,
  sandustryBuildMod,
  sandustryDebugArgs,
  sandustryLeftMonitor,
  sandustryMaximizeOnLeftMonitor,
  sandustryRequireBinary,
  sandustryStopRunning,
  sandustryWaitForDebugPort,
  writeDebugSession,
  SANDUSTRY,
  SANDUSTRY_DIR,
  spawnSandustry,
} from "../lib/sandustry-common.js";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const rendererPort = process.env.SANDUSTRY_RENDERER_DEBUG_PORT ?? DEFAULT_RENDERER_DEBUG_PORT;

sandustryRequireBinary();
sandustryBuildMod(ROOT, { sourcemap: true, extraArgs: process.argv.slice(2) });
sandustryStopRunning();

const mon = sandustryLeftMonitor();
const args = sandustryDebugArgs(rendererPort, mon);

if (process.env.SANDUSTRY_DEBUG_FOREGROUND === "1") {
  console.log(`Sandustry debug (foreground) — renderer ${rendererPort}`);
  const result = spawnSync(SANDUSTRY, args, {
    stdio: "inherit",
    cwd: SANDUSTRY_DIR,
  });
  process.exit(result.status ?? 0);
}

console.log(`Sandustry debug — renderer ${rendererPort}`);

const child = spawnSandustry(args, {
  detached: true,
  stdio: "ignore",
});

if (typeof child.pid === "number") {
  writeDebugSession({ pid: child.pid, rendererPort });
}

const ready = await sandustryWaitForDebugPort(rendererPort);
if (!ready) {
  console.error(`Sandustry CDP did not open on :${rendererPort} in time.`);
  process.exit(1);
}

void sandustryMaximizeOnLeftMonitor(mon.x, mon.y);
console.log(`Launched Sandustry with debug ports (pid ${child.pid ?? "?"}).`);
