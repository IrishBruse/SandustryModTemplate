#!/usr/bin/env node
/**
 * Build the mod, stop any running game, launch Sandustry on the left monitor.
 * Usage: npm run sandustry
 */
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  sandustryBuildMod,
  sandustryLaunchArgs,
  sandustryLeftMonitor,
  sandustryMaximizeOnLeftMonitor,
  sandustryRequireBinary,
  sandustryStopRunning,
  spawnSandustry,
} from "./sandustry-common.js";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

sandustryRequireBinary();
sandustryBuildMod(ROOT, { extraArgs: process.argv.slice(2) });
sandustryStopRunning();

const mon = sandustryLeftMonitor();
const child = spawnSandustry(sandustryLaunchArgs(mon), { detached: true, stdio: "ignore" });
sandustryMaximizeOnLeftMonitor(mon.x, mon.y);

console.log(`Launched Sandustry (pid ${child.pid ?? "?"}).`);
