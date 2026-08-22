/**
 * Shared Sandustry launch helpers (normal + debug).
 * Linux uses /proc + xrandr/wmctrl; Windows uses tasklist/taskkill and --start-maximized.
 */
import { execSync, spawn, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as sleep } from "node:timers/promises";
import {
  resolveSandustryBinary,
  sandustryBinaryName,
  sandustryInstallDir,
  sandustryModsDir,
} from "./paths.js";

const IS_WIN = process.platform === "win32";
const REPO_ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const DEBUG_SESSION_FILE = join(REPO_ROOT, ".tmp", "sandustry-debug-session.json");

export const SANDUSTRY = resolveSandustryBinary();
export const SANDUSTRY_DIR = sandustryInstallDir(SANDUSTRY);
const SANDUSTRY_EXE = sandustryBinaryName(SANDUSTRY);

export const IDE_DEBUG_ENV = "SANDUSTRY_IDE_DEBUG";
/** Per-mod file the renderer reads via `api.assets.getUrl` (no `process.env` in the game page). */
export const IDE_DEBUG_MARKER = "ide-debug.json";
export const DEFAULT_MAIN_DEBUG_PORT = "9230";
export const DEFAULT_RENDERER_DEBUG_PORT = "9222";

/**
 * Write or clear `ide-debug.json` in each local mod folder.
 * The sandboxed renderer cannot see spawn env; it loads this marker as a mod asset.
 * @param {boolean} enabled
 */
export function setIdeDebugMarker(enabled) {
  const modsDir = sandustryModsDir();
  if (!existsSync(modsDir)) return;

  for (const name of readdirSync(modsDir)) {
    const dir = join(modsDir, name);
    try {
      if (!statSync(dir).isDirectory()) continue;
    } catch {
      continue;
    }
    const file = join(dir, IDE_DEBUG_MARKER);
    if (enabled) {
      try {
        writeFileSync(file, "1\n");
      } catch {
        /* ignore unwritable folders */
      }
    } else {
      try {
        unlinkSync(file);
      } catch {
        /* already gone */
      }
    }
  }
}

/**
 * Env for the Electron main process plus a renderer-visible marker file.
 * Call from F5 / sandustry:vscode launches only.
 */
export function sandustryDebugEnv() {
  setIdeDebugMarker(true);
  return { [IDE_DEBUG_ENV]: "1" };
}

/** @typedef {{ pid: number; mainPort: string; rendererPort: string; launchedAt: number }} DebugSession */

/** @returns {DebugSession | null} */
export function readDebugSession() {
  try {
    const raw = readFileSync(DEBUG_SESSION_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (typeof parsed.pid !== "number" || !Number.isFinite(parsed.pid)) return null;
    return {
      pid: parsed.pid,
      mainPort: String(parsed.mainPort ?? DEFAULT_MAIN_DEBUG_PORT),
      rendererPort: String(parsed.rendererPort ?? DEFAULT_RENDERER_DEBUG_PORT),
      launchedAt: Number(parsed.launchedAt) || 0,
    };
  } catch {
    return null;
  }
}

/** @param {{ pid: number; mainPort: string; rendererPort: string }} session */
export function writeDebugSession({ pid, mainPort, rendererPort }) {
  mkdirSync(dirname(DEBUG_SESSION_FILE), { recursive: true });
  /** @type {DebugSession} */
  const session = {
    pid,
    mainPort: String(mainPort),
    rendererPort: String(rendererPort),
    launchedAt: Date.now(),
  };
  writeFileSync(DEBUG_SESSION_FILE, `${JSON.stringify(session, null, 2)}\n`);
}

export function clearDebugSession() {
  try {
    unlinkSync(DEBUG_SESSION_FILE);
  } catch {
    /* already gone */
  }
}

/** Sync wait that works on cmd/PowerShell (no Unix `sleep`). */
function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

/** @param {string} port */
function isDebugPortOpenSync(port) {
  try {
    execSync(`curl -sf --max-time 0.5 http://127.0.0.1:${port}/json/version`, {
      stdio: "ignore",
    });
    return true;
  } catch {
    return false;
  }
}

/** @param {string} mainPort @param {string} rendererPort @param {number} [timeoutMs] */
function waitForDebugPortsClosed(mainPort, rendererPort, timeoutMs = 5000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (!isDebugPortOpenSync(mainPort) && !isDebugPortOpenSync(rendererPort)) return true;
    sleepSync(50);
  }
  return !isDebugPortOpenSync(mainPort) && !isDebugPortOpenSync(rendererPort);
}

/** @param {string} port */
function freeDebugPort(port) {
  if (IS_WIN) {
    try {
      const out = execSync(`netstat -ano | findstr :${port}`, {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
        windowsHide: true,
      });
      const pids = new Set();
      for (const line of out.split(/\r?\n/)) {
        const parts = line.trim().split(/\s+/);
        const pid = Number(parts.at(-1));
        if (Number.isFinite(pid) && pid > 0) pids.add(pid);
      }
      for (const pid of pids) {
        try {
          execSync(`taskkill /F /PID ${pid} /T`, { stdio: "ignore", windowsHide: true });
        } catch {
          /* already gone */
        }
      }
    } catch {
      /* no listener */
    }
    return;
  }

  try {
    execSync(`fuser -k ${port}/tcp`, { stdio: "ignore" });
  } catch {
    /* no listener or fuser missing */
  }
}

/** @param {string} mainPort @param {string} rendererPort */
export function sandustryFreeDebugPorts(mainPort, rendererPort) {
  if (isDebugPortOpenSync(mainPort)) freeDebugPort(mainPort);
  if (isDebugPortOpenSync(rendererPort)) freeDebugPort(rendererPort);
}

/**
 * Poll CDP ports until both respond or timeout.
 * @param {string} mainPort
 * @param {string} rendererPort
 * @param {{ timeoutMs?: number }} [options]
 */
export async function sandustryWaitForDebugPorts(
  mainPort,
  rendererPort,
  { timeoutMs = 60000 } = {},
) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (isDebugPortOpenSync(mainPort) && isDebugPortOpenSync(rendererPort)) return true;
    await sleep(100);
  }
  return isDebugPortOpenSync(mainPort) && isDebugPortOpenSync(rendererPort);
}

export function sandustryRequireBinary() {
  if (existsSync(SANDUSTRY)) return;

  console.error(`Sandustry binary not found: ${SANDUSTRY}`);
  if (IS_WIN) {
    console.error("Set SANDUSTRY to your Sandustry.exe, for example:");
    console.error(
      "  cmd:        set SANDUSTRY=C:\\Program Files (x86)\\Steam\\steamapps\\common\\Sandustry\\Sandustry.exe",
    );
    console.error(
      '  PowerShell: $env:SANDUSTRY="C:\\Program Files (x86)\\Steam\\steamapps\\common\\Sandustry\\Sandustry.exe"',
    );
  } else {
    console.error("Set SANDUSTRY to your sandustry binary, for example:");
    console.error("  export SANDUSTRY=/path/to/steamapps/common/Sandustry/sandustry");
  }
  process.exit(1);
}

/** @param {string} root @param {{ sourcemap?: boolean; modDebug?: boolean; extraArgs?: string[] }} [options] */
export function sandustryBuildMod(
  root,
  { sourcemap = false, modDebug = true, extraArgs = [] } = {},
) {
  const args = [join(root, "scripts/build/esbuild.config.mjs"), "--game"];
  if (sourcemap) args.push("--sourcemap");
  if (!modDebug) args.push("--no-debug");
  args.push(...extraArgs);

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
export function sandustryPidsLinux() {
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

/** Root Sandustry PIDs (parent is not another Sandustry process). Linux only. */
function sandustryRootPidsLinux() {
  const all = sandustryPidsLinux();
  const set = new Set(all);
  /** @type {number[]} */
  const roots = [];
  for (const pid of all) {
    try {
      const stat = readFileSync(`/proc/${pid}/stat`, "utf8");
      const ppid = Number(stat.split(" ")[3]);
      if (!set.has(ppid)) roots.push(pid);
    } catch {
      roots.push(pid);
    }
  }
  return roots;
}

/** @param {NodeJS.Signals} signal */
function signalSandustryTrees(signal) {
  if (IS_WIN) return;
  const roots = sandustryRootPidsLinux();
  for (const pid of roots) {
    try {
      process.kill(-pid, signal);
    } catch {
      try {
        process.kill(pid, signal);
      } catch {
        /* already gone */
      }
    }
  }
  signalPids(sandustryPidsLinux(), signal);
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
  setIdeDebugMarker(false);
  const session = readDebugSession();
  clearDebugSession();

  const mainPort = session?.mainPort ?? DEFAULT_MAIN_DEBUG_PORT;
  const rendererPort = session?.rendererPort ?? DEFAULT_RENDERER_DEBUG_PORT;

  if (IS_WIN) {
    sandustryStopWindows();
    if (!waitForDebugPortsClosed(mainPort, rendererPort)) {
      sandustryFreeDebugPorts(mainPort, rendererPort);
    }
    return;
  }

  const first = sandustryPidsLinux();
  if (first.length === 0) {
    if (isDebugPortOpenSync(mainPort) || isDebugPortOpenSync(rendererPort)) {
      sandustryFreeDebugPorts(mainPort, rendererPort);
    }
    return;
  }

  console.log("Stopping Sandustry...");
  signalSandustryTrees("SIGTERM");

  const deadline = Date.now() + 3000;
  while (Date.now() < deadline) {
    if (!sandustryIsRunning()) break;
    sleepSync(50);
  }

  const leftover = sandustryPidsLinux();
  if (leftover.length > 0) signalSandustryTrees("SIGKILL");

  if (!waitForDebugPortsClosed(mainPort, rendererPort)) {
    sandustryFreeDebugPorts(mainPort, rendererPort);
  }
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
      '  "$($_.Bounds.X) $($_.Bounds.Y) $($_.Bounds.Width) $($_.Bounds.Height)"',
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

/**
 * Game WM_CLASS from `wmctrl -lx` (`instance.class`).
 * Do not match window titles — editors (e.g. Aseprite) often include "sandustry" in the title.
 */
const SANDUSTRY_WM_CLASS = "sandustry.sandustry";

/** @param {string} display @returns {string | null} hex window id */
function findSandustryWindowId(display) {
  const list = execSync(`DISPLAY=${display} wmctrl -lx`, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });
  for (const line of list.split("\n")) {
    // 0x01800004  0 sandustry.sandustry   host Title
    const match = line.match(/^(0x[0-9a-f]+)\s+\S+\s+(\S+)/i);
    if (!match) continue;
    if (match[2].toLowerCase() === SANDUSTRY_WM_CLASS) return match[1];
  }
  return null;
}

/** @param {number} monX @param {number} monY @returns {Promise<void>} */
export function sandustryMaximizeOnLeftMonitor(monX, monY) {
  // Windows: --start-maximized in launch args is enough; wmctrl is Linux-only.
  if (IS_WIN) return Promise.resolve();

  const displays = [process.env.GNOME_SETUP_DISPLAY || ":2", ":1", process.env.DISPLAY || ":0"];

  return (async () => {
    for (let attempt = 0; attempt < 60; attempt++) {
      for (const display of displays) {
        try {
          const wid = findSandustryWindowId(display);
          if (!wid) continue;

          execSync(`DISPLAY=${display} wmctrl -i -r ${wid} -e "0,${monX},${monY},-1,-1"`, {
            stdio: "ignore",
          });
          execSync(`DISPLAY=${display} wmctrl -i -r ${wid} -b add,maximized_vert,maximized_horz`, {
            stdio: "ignore",
          });
          return;
        } catch {
          // try next display
        }
      }
      await sleep(100);
    }
  })();
}

/** @param {string[]} args @param {{ cwd?: string; detached?: boolean; stdio?: "inherit" | "ignore" | "pipe"; env?: NodeJS.ProcessEnv }} [options] */
export function spawnSandustry(
  args,
  { cwd = SANDUSTRY_DIR, detached = false, stdio = "inherit", env } = {},
) {
  // No shell: keeps Program Files spaces safe on Windows.
  const child = spawn(SANDUSTRY, args, {
    cwd,
    detached,
    stdio,
    env: env ? { ...process.env, ...env } : process.env,
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
    // Chrome 111+ / Electron 33 rejects the VS Code CDP websocket without this.
    `--remote-allow-origins=*`,
    `--inspect=${mainPort}`,
    `--remote-debugging-port=${rendererPort}`,
  ]);
}
