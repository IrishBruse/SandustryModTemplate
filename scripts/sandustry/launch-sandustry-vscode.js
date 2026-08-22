#!/usr/bin/env node
/**
 * Build the mod with source maps, stop any running game, launch Sandustry with debug ports.
 * Usage: VS Code launch.json only (sandustry:vscode-background task).
 */
import { spawnSync } from "node:child_process";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  DEFAULT_MAIN_DEBUG_PORT,
  DEFAULT_RENDERER_DEBUG_PORT,
  sandustryBuildMod,
  sandustryDebugArgs,
  sandustryDebugEnv,
  sandustryLeftMonitor,
  sandustryMaximizeOnLeftMonitor,
  sandustryRequireBinary,
  sandustryStopRunning,
  SANDUSTRY,
  SANDUSTRY_DIR,
  spawnSandustry,
} from "./sandustry-common.js";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const mainPort = process.env.SANDUSTRY_MAIN_DEBUG_PORT ?? DEFAULT_MAIN_DEBUG_PORT;
const rendererPort = process.env.SANDUSTRY_RENDERER_DEBUG_PORT ?? DEFAULT_RENDERER_DEBUG_PORT;

sandustryRequireBinary();
sandustryBuildMod(ROOT, { sourcemap: true, extraArgs: process.argv.slice(2) });
sandustryStopRunning();

const mon = sandustryLeftMonitor();
const args = sandustryDebugArgs(mainPort, rendererPort, mon);

if (process.env.SANDUSTRY_DEBUG_FOREGROUND === "1") {
  console.log(`Sandustry debug (foreground) — main ${mainPort}, renderer ${rendererPort}`);
  const result = spawnSync(SANDUSTRY, args, {
    stdio: "inherit",
    cwd: SANDUSTRY_DIR,
    env: { ...process.env, ...sandustryDebugEnv() },
  });
  process.exit(result.status ?? 0);
}

console.log(`Sandustry debug — main ${mainPort}, renderer ${rendererPort}`);

const child = spawnSandustry(args, {
  detached: true,
  stdio: "inherit",
  env: sandustryDebugEnv(),
});
sandustryMaximizeOnLeftMonitor(mon.x, mon.y);
console.log(`Launched Sandustry with debug ports (pid ${child.pid ?? "?"}).`);
