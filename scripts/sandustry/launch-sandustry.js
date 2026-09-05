#!/usr/bin/env node
/**
 * Stop any running game and launch Sandustry on the configured monitor.
 * Does not build — run `npm run dev` or `npm run build` first.
 * Usage: npm run sandustry
 */
import {
  sandustryLaunchArgs,
  sandustryLaunchMonitor,
  sandustryMaximizeOnLeftMonitor,
  sandustryRequireBinary,
  sandustryStopRunning,
  spawnSandustry,
} from "../lib/sandustry-common.js";

sandustryRequireBinary();
sandustryStopRunning();

const mon = sandustryLaunchMonitor();
const child = spawnSandustry(sandustryLaunchArgs(mon), { detached: true, stdio: "ignore" });
sandustryMaximizeOnLeftMonitor(mon.x, mon.y);

console.log(`Launched Sandustry (pid ${child.pid ?? "?"}).`);
