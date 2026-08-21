/**
 * Shared Sandustry launch helpers (normal + debug).
 * Linux uses /proc + xrandr/wmctrl; Windows uses tasklist/taskkill and --start-maximized.
 */
import { execSync, spawn, spawnSync } from "node:child_process";
import { existsSync, readdirSync, readlinkSync } from "node:fs";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { ensureModDir } from "./mod-path.js";
import {
  resolveSandustryBinary,
  sandustryBinaryName,
  sandustryInstallDir,
} from "./paths.js";

const IS_WIN = process.platform === "win32";

export const SANDUSTRY = resolveSandustryBinary();
export const SANDUSTRY_DIR = sandustryInstallDir(SANDUSTRY);
const SANDUSTRY_EXE = sandustryBinaryName(SANDUSTRY);

export const DEFAULT_MAIN_DEBUG_PORT = "9230";
export const DEFAULT_RENDERER_DEBUG_PORT = "9222";

/** Sync wait that works on cmd/PowerShell (no Unix `sleep`). */
function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

export function sandustryRequireBinary() {
  if (existsSync(SANDUSTRY)) return;

  console.error(`Sandustry binary not found: ${SANDUSTRY}`);
  if (IS_WIN) {
    console.error('Set SANDUSTRY to your Sandustry.exe, for example:');
    console.error('  cmd:        set SANDUSTRY=C:\\Program Files (x86)\\Steam\\steamapps\\common\\Sandustry\\Sandustry.exe');
    console.error('  PowerShell: $env:SANDUSTRY="C:\\Program Files (x86)\\Steam\\steamapps\\common\\Sandustry\\Sandustry.exe"');
  } else {
    console.error("Set SANDUSTRY to your sandustry binary, for example:");
    console.error("  export SANDUSTRY=/path/to/steamapps/common/Sandustry/sandustry");
  }
  process.exit(1);
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
 * PIDs whose `/proc/<pid>/exe` is the Sandustry binary (Linux).
 * Avoids `pgrep -f` matching itself (and a false wait when the game is down).
 * @returns {number[]}
 */
function sandustryPidsLinux() {
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

function sandustryIsRunningWindows() {
  try {
    const out = execSync(`tasklist /FI "IMAGENAME eq ${SANDUSTRY_EXE}" /NH`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      windowsHide: true,
    });
    return out.toLowerCase().includes(SANDUSTRY_EXE.toLowerCase());
  } catch {
    return false;
  }
}

function sandustryIsRunning() {
  if (IS_WIN) return sandustryIsRunningWindows();
  return sandustryPidsLinux().length > 0;
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

function sandustryStopWindows() {
  if (!sandustryIsRunningWindows()) return;

  console.log("Stopping Sandustry...");
  try {
    execSync(`taskkill /IM "${SANDUSTRY_EXE}" /T`, {
      stdio: "ignore",
      windowsHide: true,
    });
  } catch {
    // may already be exiting
  }

  const deadline = Date.now() + 2000;
  while (Date.now() < deadline) {
    if (!sandustryIsRunningWindows()) return;
    sleepSync(50);
  }

  try {
    execSync(`taskkill /F /IM "${SANDUSTRY_EXE}" /T`, {
      stdio: "ignore",
      windowsHide: true,
    });
  } catch {
    // already gone
  }
}

export function sandustryStopRunning() {
  if (IS_WIN) {
    sandustryStopWindows();
    return;
  }

  const first = sandustryPidsLinux();
  if (first.length === 0) return;

  console.log("Stopping Sandustry...");
  signalPids(first, "SIGTERM");

  const deadline = Date.now() + 2000;
  while (Date.now() < deadline) {
    if (!sandustryIsRunning()) return;
    sleepSync(50);
  }

  const leftover = sandustryPidsLinux();
  if (leftover.length === 0) return;
  signalPids(leftover, "SIGKILL");
}

/** @returns {{ name: string; x: number; y: number; w: number; h: number }} */
function sandustryLeftMonitorLinux() {
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

/** @returns {{ name: string; x: number; y: number; w: number; h: number }} */
function sandustryLeftMonitorWindows() {
  try {
    const ps = [
      "Add-Type -AssemblyName System.Windows.Forms;",
      "[System.Windows.Forms.Screen]::AllScreens | ForEach-Object {",
      "  \"$($_.Bounds.X) $($_.Bounds.Y) $($_.Bounds.Width) $($_.Bounds.Height)\"",
      "}",
    ].join(" ");
    const result = spawnSync("powershell", ["-NoProfile", "-Command", ps], {
      encoding: "utf8",
      windowsHide: true,
    });
    const output = result.stdout ?? "";
    /** @type {{ name: string; x: number; y: number; w: number; h: number }[]} */
    const monitors = [];
    for (const line of output.split(/\r?\n/)) {
      const parts = line.trim().split(/\s+/);
      if (parts.length < 4) continue;
      const [x, y, w, h] = parts.map(Number);
      if ([x, y, w, h].some((n) => Number.isNaN(n))) continue;
      monitors.push({ name: `display-${monitors.length}`, x, y, w, h });
    }
    monitors.sort((a, b) => a.x - b.x || a.y - b.y);
    if (monitors.length > 0) {
      const mon = monitors[0];
      console.log(`Left monitor: ${mon.w}x${mon.h} at ${mon.x},${mon.y}`);
      return mon;
    }
  } catch {
    // fall through
  }

  console.log("Could not detect monitors; using 0,0 (Electron --start-maximized still applies).");
  return { name: "primary", x: 0, y: 0, w: 0, h: 0 };
}

/** @returns {{ name: string; x: number; y: number; w: number; h: number }} */
export function sandustryLeftMonitor() {
  if (IS_WIN) return sandustryLeftMonitorWindows();
  return sandustryLeftMonitorLinux();
}

/** @param {number} monX @param {number} monY */
export function sandustryMaximizeOnLeftMonitor(monX, monY) {
  // Windows: --start-maximized in launch args is enough; wmctrl is Linux-only.
  if (IS_WIN) return;

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
  // No shell: keeps Program Files spaces safe on Windows.
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
  // --no-sandbox is required on many Linux installs; Electron ignores it on Windows.
  return ["--no-sandbox", `--window-position=${mon.x},${mon.y}`, "--start-maximized", ...extra];
}

/** @param {string} mainPort @param {string} rendererPort @param {{ x: number; y: number }} mon */
export function sandustryDebugArgs(mainPort, rendererPort, mon) {
  return sandustryLaunchArgs(mon, [
    `--inspect=${mainPort}`,
    `--remote-debugging-port=${rendererPort}`,
  ]);
}
