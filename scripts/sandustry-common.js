/**
 * Shared Sandustry launch helpers (normal + debug).
 */
import { execSync, spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { ensureModDir, MOD_DIR } from "./mod-path.js";

export const SANDUSTRY =
  process.env.SANDUSTRY ?? "/home/econn/games/SteamLibrary/steamapps/common/Sandustry/sandustry";
export const SANDUSTRY_DIR = dirname(SANDUSTRY);

export const DEFAULT_MAIN_DEBUG_PORT = "9230";
export const DEFAULT_RENDERER_DEBUG_PORT = "9222";

export function sandustryRequireBinary() {
  if (!existsSync(SANDUSTRY)) {
    console.error(`Sandustry binary not found: ${SANDUSTRY}`);
    process.exit(1);
  }
}

/** @param {string} root @param {{ sourcemap?: boolean }} [options] */
export function sandustryBuildMod(root, { sourcemap = false } = {}) {
  ensureModDir();
  /** @type {NodeJS.ProcessEnv} */
  const env = { ...process.env, MOD_OUT_DIR: MOD_DIR };
  if (sourcemap) env.MOD_SOURCEMAP = "1";

  const result = spawnSync("node", [join(root, "esbuild.config.mjs")], {
    stdio: "inherit",
    env,
    cwd: root,
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function sandustryIsRunning() {
  try {
    execSync(`pgrep -f "${SANDUSTRY_DIR}/sandustry"`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

export function sandustryStopRunning() {
  if (!sandustryIsRunning()) return;

  console.log("Stopping Sandustry...");
  try {
    execSync(`pkill -TERM -f "${SANDUSTRY_DIR}/sandustry"`, { stdio: "ignore" });
  } catch {
    // already stopped
  }

  for (let i = 0; i < 20; i++) {
    if (!sandustryIsRunning()) return;
    execSync("sleep 0.25");
  }

  try {
    execSync(`pkill -KILL -f "${SANDUSTRY_DIR}/sandustry"`, { stdio: "ignore" });
  } catch {
    // ignore
  }
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
export function spawnSandustry(args, { cwd = SANDUSTRY_DIR, detached = false, stdio = "inherit" } = {}) {
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
  return [
    "--no-sandbox",
    `--window-position=${mon.x},${mon.y}`,
    "--start-maximized",
    ...extra,
  ];
}

/** @param {string} mainPort @param {string} rendererPort @param {{ x: number; y: number }} mon */
export function sandustryDebugArgs(mainPort, rendererPort, mon) {
  return sandustryLaunchArgs(mon, [
    `--inspect=${mainPort}`,
    `--remote-debugging-port=${rendererPort}`,
  ]);
}
