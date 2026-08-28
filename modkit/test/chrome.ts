import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import { existsSync, mkdirSync, openSync, rmSync } from "node:fs";
import { dirname } from "node:path";
import {
  sandustryTestChromeDir,
  sandustryTestChromeLog,
  SANDUSTRY_TEST_CDP_PORT,
} from "./paths.ts";

export type HostWindowMode = "headless" | "xvfb" | "window";

export function hostWindowMode(input?: {
  visible?: boolean;
  platform?: NodeJS.Platform;
  display?: string | undefined;
}): HostWindowMode {
  const visible = input?.visible === true;
  const platform = input?.platform ?? process.platform;
  const display = input && "display" in input ? input.display : process.env.DISPLAY;
  if (visible && (platform === "win32" || display)) return "window";
  if (platform === "win32") return "headless";
  return "xvfb";
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

export function spawnChrome(chrome: string, url: string, visible: boolean): ChildProcess {
  stopChrome();
  mkdirSync(dirname(sandustryTestChromeLog()), { recursive: true });
  rmSync(sandustryTestChromeDir(), { recursive: true, force: true });
  mkdirSync(sandustryTestChromeDir(), { recursive: true });
  const logFd = openSync(sandustryTestChromeLog(), "w");
  const args = [
    `--user-data-dir=${sandustryTestChromeDir()}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-allow-origins=*",
    `--remote-debugging-port=${SANDUSTRY_TEST_CDP_PORT}`,
    "--window-size=1280,720",
    "--autoplay-policy=no-user-gesture-required",
    "--disable-background-timer-throttling",
    "--disable-renderer-backgrounding",
    "--disable-backgrounding-occluded-windows",
    "--ignore-gpu-blocklist",
    "--enable-webgl",
    "--enable-webgl2",
  ];
  const mode = hostWindowMode({ visible });
  if (mode === "window") args.push("--window-position=50,50");
  if (mode === "headless") {
    args.unshift(
      "--headless=new",
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
    );
    args.push(url);
    return spawn(chrome, args, { stdio: ["ignore", logFd, logFd] });
  }
  if (mode === "window") {
    args.push(url);
    return spawn(chrome, args, { stdio: ["ignore", logFd, logFd] });
  }
  args.unshift(
    "--ozone-platform=x11",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
  );
  args.push(url);
  const env: NodeJS.ProcessEnv = { ...process.env, XDG_SESSION_TYPE: "x11" };
  delete env.WAYLAND_DISPLAY;
  if (!hasXvfb()) {
    return spawn(chrome, args, { stdio: ["ignore", logFd, logFd], env });
  }
  return spawn(
    "xvfb-run",
    ["--auto-servernum", "--server-args=-screen 0 1280x720x24", chrome, ...args],
    { stdio: ["ignore", logFd, logFd], env },
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
