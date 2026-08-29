import { spawn, spawnSync, type ChildProcess, type SpawnOptions } from "node:child_process";
import { existsSync, mkdirSync, openSync, rmSync } from "node:fs";
import { dirname } from "node:path";
import {
  sandustryTestChromeDir,
  sandustryTestChromeLog,
  SANDUSTRY_TEST_CDP_PORT,
  SANDUSTRY_TEST_VIEWPORT_HEIGHT,
  SANDUSTRY_TEST_VIEWPORT_WIDTH,
} from "./paths.ts";

export type HostWindowMode = "headless" | "xvfb" | "window";

/** Lower than the desktop / Steam game so the test host yields CPU. */
const CHROME_NICE = 10;

export function hostWindowMode(input?: {
  visible?: boolean;
  platform?: NodeJS.Platform;
  display?: string | undefined;
}): HostWindowMode {
  const visible = input?.visible === true;
  const platform = input?.platform ?? process.platform;
  const display = input && "display" in input ? input.display : process.env.DISPLAY;
  if (visible && (platform === "win32" || platform === "darwin" || display)) return "window";
  return "headless";
}

export function resolveChrome(): string | null {
  const fromEnv = process.env.CHROME?.trim();
  if (fromEnv && existsSync(fromEnv)) return fromEnv;
  for (const name of ["google-chrome-stable", "google-chrome", "chromium", "chromium-browser"]) {
    const found = spawnSync("which", [name], { encoding: "utf8" });
    if (found.status === 0 && typeof found.stdout === "string" && found.stdout.trim()) {
      return found.stdout.trim();
    }
  }
  return null;
}

function hasXvfb(): boolean {
  if (process.platform === "win32") return true;
  return spawnSync("which", ["xvfb-run"], { encoding: "utf8" }).status === 0;
}

export function stopChrome(): void {
  spawnSync("pkill", ["-f", `${sandustryTestChromeDir()}`], { stdio: "ignore" });
}

/** SwiftShader keeps CI screenshot baselines stable. Local runs prefer the GPU. */
export function useSwiftShader(): boolean {
  return Boolean(process.env.CI);
}

/** Chrome flags for the integration test host. */
export function chromeLaunchArgs(mode: HostWindowMode): string[] {
  const args = [
    `--user-data-dir=${sandustryTestChromeDir()}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-allow-origins=*",
    `--remote-debugging-port=${SANDUSTRY_TEST_CDP_PORT}`,
    `--window-size=${SANDUSTRY_TEST_VIEWPORT_WIDTH},${SANDUSTRY_TEST_VIEWPORT_HEIGHT}`,
    "--autoplay-policy=no-user-gesture-required",
    "--ignore-gpu-blocklist",
    "--enable-webgl",
    "--enable-webgl2",
    "--use-gl=angle",
    // Keep the test Chromium light so Steam Sandustry stays responsive.
    "--renderer-process-limit=2",
    "--num-raster-threads=1",
  ];
  if (useSwiftShader()) {
    args.push("--use-angle=swiftshader", "--enable-unsafe-swiftshader");
  }
  // CI keeps full frame rate for stable screenshots. Local runs may throttle.
  if (process.env.CI) {
    args.push(
      "--disable-background-timer-throttling",
      "--disable-renderer-backgrounding",
      "--disable-backgrounding-occluded-windows",
    );
  }
  if (mode === "headless") {
    args.unshift("--headless=new");
    // Headless defaults to 800x600 ozone size; pin it to the test viewport.
    args.push(
      `--ozone-override-screen-size=${SANDUSTRY_TEST_VIEWPORT_WIDTH},${SANDUSTRY_TEST_VIEWPORT_HEIGHT}`,
    );
  }
  if (mode === "xvfb") args.unshift("--ozone-platform=x11");
  if (mode === "window") args.push("--window-position=50,50");
  return args;
}

/**
 * Spawn under `nice` on Unix so the test host yields to Steam / the desktop.
 * Windows has no portable equivalent here.
 */
export function spawnLowPriority(
  command: string,
  args: string[],
  options: SpawnOptions,
): ChildProcess {
  if (process.platform === "win32") {
    return spawn(command, args, options);
  }
  return spawn("nice", ["-n", String(CHROME_NICE), command, ...args], options);
}

export function spawnChrome(chrome: string, url: string, visible: boolean): ChildProcess {
  stopChrome();
  mkdirSync(dirname(sandustryTestChromeLog()), { recursive: true });
  rmSync(sandustryTestChromeDir(), { recursive: true, force: true });
  mkdirSync(sandustryTestChromeDir(), { recursive: true });
  const logFd = openSync(sandustryTestChromeLog(), "w");
  const mode = hostWindowMode({ visible });
  const args = [...chromeLaunchArgs(mode), url];
  const stdio = ["ignore", logFd, logFd] as const;
  if (mode === "headless" || mode === "window") {
    return spawnLowPriority(chrome, args, { stdio: [...stdio] });
  }
  const env: NodeJS.ProcessEnv = { ...process.env, XDG_SESSION_TYPE: "x11" };
  delete env.WAYLAND_DISPLAY;
  if (!hasXvfb()) {
    return spawnLowPriority(chrome, args, { stdio: [...stdio], env });
  }
  return spawnLowPriority(
    "xvfb-run",
    [
      "--auto-servernum",
      `--server-args=-screen 0 ${SANDUSTRY_TEST_VIEWPORT_WIDTH}x${SANDUSTRY_TEST_VIEWPORT_HEIGHT}x24`,
      chrome,
      ...args,
    ],
    { stdio: [...stdio], env },
  );
}

export function stopChild(child: ChildProcess | null): void {
  if (child?.pid) {
    try {
      process.kill(child.pid, "SIGTERM");
    } catch {
      /* already gone */
    }
  }
  stopChrome();
}
