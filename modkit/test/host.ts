import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { isSandustryAvailable } from "./cdp.ts";
import {
  repoRoot,
  sandustryTestHostFile,
  sandustryTestModsDir,
  sandustryTestUserDataDir,
  sandustryUserDataDir,
  SANDUSTRY_TEST_CDP_PORT,
} from "./paths.ts";

export type HostStartResult = { ok: true; reused: boolean } | { ok: false; reason: string };

export type HostWindowMode = "headless" | "xvfb" | "window";

export function hostWindowMode(input?: {
  visible?: boolean;
  platform?: NodeJS.Platform;
}): HostWindowMode {
  const visible = input?.visible === true;
  const platform = input?.platform ?? process.platform;
  if (visible) return "window";
  // Chromium `--headless` stalls WebGL on Linux; xvfb keeps a virtual display with no window.
  if (platform === "win32") return "headless";
  return "xvfb";
}

type HostRecord = {
  pid: number;
  port: string;
  launchedAt: number;
};

const HOST_WAIT_MS = 60000;
const AUTO_LOAD_LAST_PLAYED = "__last__";
const TEST_MOD_IDS = ["author.template", "hot-reload"] as const;

function readHostRecord(): HostRecord | null {
  try {
    const parsed = JSON.parse(readFileSync(sandustryTestHostFile(), "utf8")) as HostRecord;
    if (typeof parsed.pid !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeHostRecord(record: HostRecord): void {
  mkdirSync(dirname(sandustryTestHostFile()), { recursive: true });
  writeFileSync(sandustryTestHostFile(), `${JSON.stringify(record, null, 2)}\n`);
}

function pidAlive(pid: number): boolean {
  if (pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function resolveBinary(): Promise<string | null> {
  try {
    // @ts-expect-error JS helper lives outside the kit tsconfig
    const { resolveSandustryBinary } = await import("../../scripts/lib/paths.js");
    const resolved = resolveSandustryBinary();
    if (typeof resolved === "string" && existsSync(resolved)) return resolved;
  } catch {
    /* fall through */
  }
  const fromEnv = process.env.SANDUSTRY?.trim();
  if (fromEnv && existsSync(fromEnv)) return fromEnv;
  return null;
}

function hasXvfb(): boolean {
  if (process.platform === "win32") return true;
  const result = spawnSync("which", ["xvfb-run"], { encoding: "utf8" });
  return result.status === 0;
}

function copyMods(): string[] {
  const destRoot = sandustryTestModsDir();
  mkdirSync(destRoot, { recursive: true });
  const copied: string[] = [];
  const sources = [join(repoRoot(), "dist"), join(sandustryUserDataDir(), "mods")];
  for (const id of TEST_MOD_IDS) {
    for (const sourceRoot of sources) {
      const from = join(sourceRoot, id);
      if (!existsSync(join(from, "modinfo.json"))) continue;
      cpSync(from, join(destRoot, id), { recursive: true, force: true });
      copied.push(id);
      break;
    }
  }
  return copied;
}

function copyLastPlayedSave(userData: string): string | null {
  const lastPath = join(sandustryUserDataDir(), "meta", "lastPlayedGame.json");
  if (!existsSync(lastPath)) return null;
  let last: { id?: unknown };
  try {
    last = JSON.parse(readFileSync(lastPath, "utf8")) as { id?: unknown };
  } catch {
    return null;
  }
  if (typeof last.id !== "string" || !last.id) return null;
  const saveName = `${last.id}.save`;
  const from = join(sandustryUserDataDir(), "saves", saveName);
  if (!existsSync(from)) return null;
  mkdirSync(join(userData, "saves"), { recursive: true });
  mkdirSync(join(userData, "meta"), { recursive: true });
  cpSync(from, join(userData, "saves", saveName));
  writeFileSync(
    join(userData, "meta", "lastPlayedGame.json"),
    `${JSON.stringify({ id: last.id })}\n`,
  );
  return last.id;
}

export function testCompanionSettings(): Record<string, unknown> {
  return {
    settingsVersion: 12,
    windowMode: "windowed",
    autosaveInterval: 0,
    externalModSettings: {
      "hot-reload": {
        enabled: true,
        autoLoad: true,
        startSave: AUTO_LOAD_LAST_PLAYED,
        disableAutosave: true,
        watchLocalMods: true,
        fastBoot: true,
        openDevTools: false,
        f12DevTools: false,
        f3Debug: false,
      },
      "author.template": { enabled: true },
    },
  };
}

export function prepareSandustryTestUserData(): { mods: string[]; saveId: string | null } {
  const userData = sandustryTestUserDataDir();
  mkdirSync(join(userData, "meta"), { recursive: true });
  mkdirSync(join(userData, "saves"), { recursive: true });
  const mods = copyMods();
  const saveId = copyLastPlayedSave(userData);
  writeFileSync(
    join(userData, "meta", "settings.json"),
    `${JSON.stringify(testCompanionSettings())}\n`,
  );
  return { mods, saveId };
}

function spawnHost(binary: string, detached: boolean, visible: boolean): ChildProcess {
  const userData = sandustryTestUserDataDir();
  mkdirSync(dirname(sandustryTestHostFile()), { recursive: true });
  const logFd = openSync(join(repoRoot(), ".tmp", "sandustry-test-host.log"), "w");
  const chromeArgs = [
    `--user-data-dir=${userData}`,
    "--no-sandbox",
    "--remote-allow-origins=*",
    `--remote-debugging-port=${SANDUSTRY_TEST_CDP_PORT}`,
    "--window-size=1280,720",
    "--disable-background-timer-throttling",
    "--disable-renderer-backgrounding",
    "--disable-backgrounding-occluded-windows",
  ];
  const cwd = dirname(binary);
  const mode = hostWindowMode({ visible });
  if (mode === "headless") {
    chromeArgs.push("--headless=new");
    return spawn(binary, chromeArgs, {
      cwd,
      detached,
      stdio: ["ignore", logFd, logFd],
      windowsHide: true,
    });
  }
  if (mode === "xvfb") {
    // Force X11 so Wayland sessions do not open a real compositor window.
    chromeArgs.push("--ozone-platform=x11");
    const env: NodeJS.ProcessEnv = { ...process.env, XDG_SESSION_TYPE: "x11" };
    delete env.WAYLAND_DISPLAY;
    return spawn(
      "xvfb-run",
      ["--auto-servernum", "--server-args=-screen 0 1280x720x24", binary, ...chromeArgs],
      { cwd, detached, stdio: ["ignore", logFd, logFd], env },
    );
  }
  // Visible window (`npm run test:integration`).
  chromeArgs.push("--window-position=50,50");
  return spawn(binary, chromeArgs, {
    cwd,
    detached,
    stdio: ["ignore", logFd, logFd],
    windowsHide: false,
  });
}

async function waitForCdp(timeoutMs: number): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await isSandustryAvailable(SANDUSTRY_TEST_CDP_PORT)) return true;
    await sleep(200);
  }
  return isSandustryAvailable(SANDUSTRY_TEST_CDP_PORT);
}

function stopPid(pid: number): void {
  if (pid <= 0) return;
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/PID", String(pid), "/T", "/F"], {
      stdio: "ignore",
      windowsHide: true,
    });
    return;
  }
  try {
    process.kill(-pid, "SIGTERM");
  } catch {
    try {
      process.kill(pid, "SIGTERM");
    } catch {
      /* already gone */
    }
  }
}

export async function stopSandustryTestHost(): Promise<void> {
  const record = readHostRecord();
  if (record && pidAlive(record.pid)) stopPid(record.pid);
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    if (!(await isSandustryAvailable(SANDUSTRY_TEST_CDP_PORT))) break;
    await sleep(100);
  }
  if (await isSandustryAvailable(SANDUSTRY_TEST_CDP_PORT)) {
    // Last resort: kill by recorded pid only (never fuser — it can hang).
    if (record && pidAlive(record.pid)) {
      try {
        process.kill(record.pid, "SIGKILL");
      } catch {
        /* gone */
      }
    }
  }
  try {
    unlinkSync(sandustryTestHostFile());
  } catch {
    /* missing */
  }
}

export async function startSandustryTestHost(options?: {
  persist?: boolean;
  visible?: boolean;
}): Promise<HostStartResult> {
  const visible = options?.visible === true;
  if (await isSandustryAvailable(SANDUSTRY_TEST_CDP_PORT)) {
    // In-test cases reuse the runner host. Persist starts (npm test) always relaunch.
    if (process.env.SANDUSTRY_TEST_HOST === "1" && !options?.persist) {
      return { ok: true, reused: true };
    }
    await stopSandustryTestHost();
  }
  if (process.env.SANDUSTRY_TEST_HOST === "1" && !options?.persist) {
    return { ok: false, reason: "Sandustry test host did not start" };
  }

  const binary = await resolveBinary();
  if (!binary) {
    return { ok: false, reason: "Sandustry binary not found" };
  }
  if (visible && process.platform !== "win32" && !process.env.DISPLAY) {
    return { ok: false, reason: "DISPLAY is missing" };
  }
  if (!visible && process.platform !== "win32" && !hasXvfb()) {
    return { ok: false, reason: "xvfb-run is missing" };
  }

  const prepared = prepareSandustryTestUserData();
  if (!prepared.mods.includes("hot-reload") || !prepared.mods.includes("author.template")) {
    return { ok: false, reason: "test mods missing; run npm run dev -- --mod template" };
  }

  // Always detach so stopPid can signal the host process group (xvfb-run + sandustry).
  const child = spawnHost(binary, true, visible);
  if (typeof child.pid !== "number") {
    return { ok: false, reason: "Sandustry test host did not start" };
  }
  if (!options?.persist) child.unref();
  writeHostRecord({ pid: child.pid, port: SANDUSTRY_TEST_CDP_PORT, launchedAt: Date.now() });

  if (!options?.persist) {
    process.once("exit", () => stopPid(child.pid as number));
  }

  const ready = await waitForCdp(HOST_WAIT_MS);
  if (!ready) {
    stopPid(child.pid);
    return {
      ok: false,
      reason: `Sandustry test host CDP :${SANDUSTRY_TEST_CDP_PORT} did not open`,
    };
  }
  return { ok: true, reused: false };
}
