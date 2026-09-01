#!/usr/bin/env node
/**
 * VS Code F5 launcher — same window placement as launch-sandustry.js,
 * with Chrome remote-debugging-port for the Sandustry Renderer attach.
 *
 * Default (F5 Node launch): stay in the foreground so debugger Restart
 * kills this process tree (Electron included) and starts a new one.
 *
 * Set SANDUSTRY_DEBUG_DETACHED=1 for the background preLaunchTask: spawn the
 * game, wait for CDP, print the ready line, wait for maximize, then exit so
 * attach configs can connect without killing the wmctrl poll via process.exit
 * too early.
 *
 * F5 **Sandustry** opens the newest save in that mod’s test world
 * (`worldId` = `<modinfo.id>`). Creates the world when it is missing.
 * Does not overwrite. Does not uninstall other local mods.
 * Does not change last-played (Continue stays on your campaign).
 * **Sandustry (all mods)** Continues.
 */
import { cdpNavigateDbLoad } from "../lib/cdp-db-load.js";
import { ensureModDebugSaves, latestSteamSaveForWorld } from "../lib/debug-save.js";
import {
  DEFAULT_RENDERER_DEBUG_PORT,
  sandustryDebugArgs,
  sandustryLeftMonitor,
  sandustryMaximizeOnLeftMonitor,
  sandustryRequireBinary,
  sandustryStopRunning,
  sandustryWaitForDebugPort,
  writeDebugSession,
  SANDUSTRY_DIR,
  spawnSandustry,
} from "../lib/sandustry-common.js";
import { pickDebugMod } from "./pick-debug-mod.js";
import { writeLastSelection } from "../dev/pick-dev-mods.js";

const rendererPort = process.env.SANDUSTRY_RENDERER_DEBUG_PORT ?? DEFAULT_RENDERER_DEBUG_PORT;
const detached = process.env.SANDUSTRY_DEBUG_DETACHED === "1";
const argv = process.argv.slice(2);
const extraArgs = electronExtraArgs(argv);
/** @type {string | null} */
let saveId = null;

if (argv.includes("--all")) {
  writeLastSelection(null);
  console.log("Debug all mods.");
} else {
  const choice = await pickDebugMod(argv);
  writeLastSelection([choice.folder]);
  const save = ensureModDebugSaves(choice);
  const latest = latestSteamSaveForWorld(save.id);
  saveId = latest?.id ?? save.id;
  if (save.created) {
    console.log(`Created Void save ${save.id} (${save.filePath}).`);
  }
  console.log(
    saveId === save.id ? `Loading save ${saveId}.` : `Loading save ${saveId} (world ${save.id}).`,
  );
}

sandustryRequireBinary();
sandustryStopRunning();

console.log(`Sandustry debug — renderer ${rendererPort}`);

const mon = sandustryLeftMonitor();
const args = [...sandustryDebugArgs(rendererPort, mon), ...extraArgs];
const child = spawnSandustry(args, {
  cwd: SANDUSTRY_DIR,
  detached,
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

if (saveId) {
  try {
    const nav = await cdpNavigateDbLoad(rendererPort, saveId);
    if (nav.navigated) console.log(`Loading save ${saveId}.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Could not open save via CDP: ${message}`);
  }
}

console.log(`Launched Sandustry with debug ports (pid ${child.pid ?? "?"}).`);

if (detached) {
  // Must finish maximize before exit — process.exit aborts the wmctrl poll.
  await sandustryMaximizeOnLeftMonitor(mon.x, mon.y);
  process.exit(0);
}

void sandustryMaximizeOnLeftMonitor(mon.x, mon.y);

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});

function stopChild() {
  sandustryStopRunning();
}

process.on("SIGINT", stopChild);
process.on("SIGTERM", stopChild);

/** Drop `--mod` / `--all` so Electron does not see them. */
function electronExtraArgs(launchArgv) {
  /** @type {string[]} */
  const extra = [];
  for (let i = 0; i < launchArgv.length; i++) {
    const arg = launchArgv[i];
    if (arg === "--all") continue;
    if (arg === "--mod") {
      i += 1;
      continue;
    }
    if (arg.startsWith("--mod=")) continue;
    extra.push(arg);
  }
  return extra;
}
