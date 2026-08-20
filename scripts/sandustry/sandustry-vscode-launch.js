#!/usr/bin/env node
/**
 * VS Code F5 launcher — same window placement as launch-sandustry.js,
 * with Node/Chrome debug ports for Sandustry + Sandustry Renderer configs.
 */
import {
  DEFAULT_MAIN_DEBUG_PORT,
  DEFAULT_RENDERER_DEBUG_PORT,
  sandustryDebugArgs,
  sandustryLeftMonitor,
  sandustryMaximizeOnLeftMonitor,
  sandustryRequireBinary,
  SANDUSTRY_DIR,
  spawnSandustry,
} from "./sandustry-common.js";

const mainPort = process.env.SANDUSTRY_MAIN_DEBUG_PORT ?? DEFAULT_MAIN_DEBUG_PORT;
const rendererPort = process.env.SANDUSTRY_RENDERER_DEBUG_PORT ?? DEFAULT_RENDERER_DEBUG_PORT;
const extraArgs = process.argv.slice(2);

sandustryRequireBinary();

const mon = sandustryLeftMonitor();
sandustryMaximizeOnLeftMonitor(mon.x, mon.y);

const args = [...sandustryDebugArgs(mainPort, rendererPort, mon), ...extraArgs];
const child = spawnSandustry(args, { cwd: SANDUSTRY_DIR, stdio: "inherit" });

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});

process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));
