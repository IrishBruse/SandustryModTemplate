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
 */
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

const rendererPort = process.env.SANDUSTRY_RENDERER_DEBUG_PORT ?? DEFAULT_RENDERER_DEBUG_PORT;
const detached = process.env.SANDUSTRY_DEBUG_DETACHED === "1";
const extraArgs = process.argv.slice(2);

sandustryRequireBinary();
sandustryStopRunning();

console.log(`Sandustry debug — renderer ${rendererPort}`);

const mon = sandustryLeftMonitor();
const args = [...sandustryDebugArgs(rendererPort, mon), ...extraArgs];
const child = spawnSandustry(args, {
  cwd: SANDUSTRY_DIR,
  detached,
  stdio: "inherit",
});

if (typeof child.pid === "number") {
  writeDebugSession({ pid: child.pid, rendererPort });
}

const ready = await sandustryWaitForDebugPort(rendererPort);
if (!ready) {
  console.error(`Sandustry CDP did not open on :${rendererPort} in time.`);
  process.exit(1);
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
