#!/usr/bin/env node
/**
 * VS Code F5 launcher — same window placement as launch-sandustry.js,
 * with Node/Chrome debug ports for the Sandustry compound (Main + Renderer).
 *
 * Set SANDUSTRY_DEBUG_DETACHED=1 for the background preLaunchTask: spawn the
 * game, print the ready line, and exit so attach configs can connect.
 */
import {
  DEFAULT_MAIN_DEBUG_PORT,
  DEFAULT_RENDERER_DEBUG_PORT,
  sandustryDebugArgs,
  sandustryDebugEnv,
  sandustryLeftMonitor,
  sandustryMaximizeOnLeftMonitor,
  sandustryRequireBinary,
  SANDUSTRY_DIR,
  spawnSandustry,
} from "./sandustry-common.js";

const mainPort = process.env.SANDUSTRY_MAIN_DEBUG_PORT ?? DEFAULT_MAIN_DEBUG_PORT;
const rendererPort = process.env.SANDUSTRY_RENDERER_DEBUG_PORT ?? DEFAULT_RENDERER_DEBUG_PORT;
const detached = process.env.SANDUSTRY_DEBUG_DETACHED === "1";
const extraArgs = process.argv.slice(2);

sandustryRequireBinary();

console.log(`Sandustry debug — main ${mainPort}, renderer ${rendererPort}`);

const mon = sandustryLeftMonitor();
sandustryMaximizeOnLeftMonitor(mon.x, mon.y);

const args = [...sandustryDebugArgs(mainPort, rendererPort, mon), ...extraArgs];
const child = spawnSandustry(args, {
  cwd: SANDUSTRY_DIR,
  detached,
  stdio: "inherit",
  env: sandustryDebugEnv(),
});

if (detached) {
  console.log(`Launched Sandustry with debug ports (pid ${child.pid ?? "?"}).`);
  process.exit(0);
}

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});

process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));
