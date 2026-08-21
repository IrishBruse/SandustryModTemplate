/**
 * Shared Sandustry launch helpers (normal + debug).
 */
import { execSync, spawn, spawnSync } from "node:child_process";
import { existsSync, readdirSync, readlinkSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { ensureModDir } from "./mod-path.js";

export const SANDUSTRY =
  process.env.SANDUSTRY ??
  join(homedir(), "games/SteamLibrary/steamapps/common/Sandustry/sandustry");
export const SANDUSTRY_DIR = dirname(SANDUSTRY);

export const DEFAULT_MAIN_DEBUG_PORT = "9230";
export const DEFAULT_RENDERER_DEBUG_PORT = "9222";

export function sandustryRequireBinary() {
  if (!existsSync(SANDUSTRY)) {
    console.error(`Sandustry binary not found: ${SANDUSTRY}`);
    process.exit(1);
  }
}

/** @param {string} root @param {{ sourcemap?: boolean; modDebug?: boolean }} [options] */
export function sandustryBuildMod(root, { sourcemap = false, modDebug = true } = {}) {
  ensureModDir();
  const args = [join(root, "scripts/build/esbuild.config.mjs"), "--game"];
  if (sourcemap) args.push("--sourcemap");
  if (!modDebug) args.push("--no-debug");

  const result = spawnSync("node", args, {
    stdio: "inherit",
    cwd: root,
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

/**
 * PIDs whose `/proc/<pid>/exe` is the Sandustry binary.
 * Avoids `pgrep -f` matching itself (and a 5s false wait when the game is down).
 * @returns {number[]}
 */
function sandustryPids() {
  /** @type {number[]} */
  const pids = [];
  let entries;
  try {
    entries = readdirSync("/proc");
  } catch {
    return pids;
  }

  for (const name of entries) {
    if (!/^\d+$/.test(name)) continue;
    try {
      const exe = readlinkSync(`/proc/${name}/exe`);
      // Deleted binaries show as "/path/sandustry (deleted)".
      if (exe === SANDUSTRY || exe.startsWith(`${SANDUSTRY} `)) pids.push(Number(name));
    } catch {
      // No permission or process exited.
    }
  }
  return pids;
}

function sandustryIsRunning() {
  return sandustryPids().length > 0;
}

/** @param {number[]} pids @param {NodeJS.Signals} signal */
function signalPids(pids, signal) {
  for (const pid of pids) {
    try {
      process.kill(pid, signal);
    } catch {
      // already gone
    }
  }
}

export function sandustryStopRunning() {
  const first = sandustryPids();
  if (first.length === 0) return;

  console.log("Stopping Sandustry...");
  signalPids(first, "SIGTERM");

  const deadline = Date.now() + 2000;
  while (Date.now() < deadline) {
    if (!sandustryIsRunning()) return;
    execSync("sleep 0.05");
  }

  const leftover = sandustryPids();
  if (leftover.length === 0) return;
  signalPids(leftover, "SIGKILL");
}

/** @returns {{ name: string; x: number; y: number; w: number; h: number }} */
export function sandustryLeftMonitor() {
  const output = execSync("xrandr --query", { encoding: "utf8" });
  /** @type {{ name: string; x: number; y: number; w: number; h: number }[]} */
  const monitors = [];

  for (const line of output.split("\n")) {
    const match = line.match(/^(\S+) connected .*?(\d+)x(\d+)\+(\d+)\+(\d+)/);
    if (!match) continue;
    monitors.push({
      name: match[1],
      w: Number(match[2]),
      h: Number(match[3]),
      x: Number(match[4]),
      y: Number(match[5]),
    });
  }

  monitors.sort((a, b) => a.x - b.x || a.y - b.y);
  if (monitors.length === 0) {
    console.error("Could not detect monitors from xrandr.");
    process.exit(1);
  }

  const mon = monitors[0];
  console.log(`Left monitor: ${mon.name} ${mon.w}x${mon.h} at ${mon.x},${mon.y}`);
  return mon;
}

/** @param {number} monX @param {number} monY */
export function sandustryMaximizeOnLeftMonitor(monX, monY) {
  const displays = [process.env.GNOME_SETUP_DISPLAY || ":2", ":1", process.env.DISPLAY || ":0"];

  void (async () => {
    for (let attempt = 0; attempt < 60; attempt++) {
      for (const display of displays) {
        try {
          const list = execSync(`DISPLAY=${display} wmctrl -l`, {
            encoding: "utf8",
            stdio: ["ignore", "pipe", "ignore"],
          });
          if (!/sandustry/i.test(list)) continue;

          execSync(`DISPLAY=${display} wmctrl -r "Sandustry" -e "0,${monX},${monY},-1,-1"`, {
            stdio: "ignore",
          });
          execSync(
            `DISPLAY=${display} wmctrl -r "Sandustry" -b add,maximized_vert,maximized_horz`,
            { stdio: "ignore" },
          );
          return;
        } catch {
          // try next display
        }
      }
      await sleep(100);
    }
  })();
}

/** @param {string[]} args @param {{ cwd?: string; detached?: boolean; stdio?: "inherit" | "ignore" | "pipe" }} [options] */
export function spawnSandustry(
  args,
  { cwd = SANDUSTRY_DIR, detached = false, stdio = "inherit" } = {},
) {
  const child = spawn(SANDUSTRY, args, {
    cwd,
    detached,
    stdio,
    env: process.env,
  });

  if (detached) child.unref();
  return child;
}

/** @param {string[]} args */
export function sandustryLaunchArgs(mon, extra = []) {
  return ["--no-sandbox", `--window-position=${mon.x},${mon.y}`, "--start-maximized", ...extra];
}

/** @param {string} mainPort @param {string} rendererPort @param {{ x: number; y: number }} mon */
export function sandustryDebugArgs(mainPort, rendererPort, mon) {
  return sandustryLaunchArgs(mon, [
    `--inspect=${mainPort}`,
    `--remote-debugging-port=${rendererPort}`,
  ]);
}
