import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

/** Isolated Chromium CDP. Steam / F5 stay on :9222. */
export const SANDUSTRY_TEST_CDP_PORT = "9224";
export const SANDUSTRY_TEST_HTTP_PORT = 4173;
export const SANDUSTRY_TEST_VIEWPORT_WIDTH = 1280;
export const SANDUSTRY_TEST_VIEWPORT_HEIGHT = 720;

export function repoRoot(): string {
  return REPO_ROOT;
}

export function sandustryTestUserDataDir(): string {
  return join(REPO_ROOT, ".tmp", "sandustry-test");
}

export function sandustryTestHostFile(): string {
  return join(REPO_ROOT, ".tmp", "sandustry-test-host.json");
}

export function sandustryTestModsDir(): string {
  return join(sandustryTestUserDataDir(), "mods");
}

export function sandustryTestMockPath(): string {
  return join(sandustryTestUserDataDir(), "electron-mock.js");
}

export function sandustryTestSavesDir(): string {
  return join(sandustryTestUserDataDir(), "saves");
}

export function sandustryTestChromeDir(): string {
  return join(REPO_ROOT, ".tmp", "sandustry-test-chrome");
}

export function sandustryTestChromeLog(): string {
  return join(REPO_ROOT, ".tmp", "sandustry-test-chrome.log");
}

export function sandustryTestScreenshotsDir(): string {
  return join(REPO_ROOT, ".tmp", "sandustry-test-screenshots");
}

/** Steam / OS Electron user-data (the running player profile). */
export function sandustryUserDataDir(): string {
  if (process.platform === "win32") {
    const appData = process.env.APPDATA || join(homedir(), "AppData", "Roaming");
    return join(appData, "sandustry");
  }
  return join(homedir(), ".config", "sandustry");
}

export function sandustryModsDir(): string {
  return sandustryTestModsDir();
}

export function installedModFile(modId: string, fileName: string): string {
  return join(sandustryTestModsDir(), modId, fileName);
}

export function installedModMain(modId: string): string {
  return installedModFile(modId, "main.js");
}

export function tryReadInstalledModFile(modId: string, fileName: string): string | null {
  try {
    return readFileSync(installedModFile(modId, fileName), "utf8");
  } catch {
    return null;
  }
}

export function tryReadInstalledModMain(modId: string): string | null {
  return tryReadInstalledModFile(modId, "main.js");
}

/** Newest `sandustry/<version>-<branch>/dist` that has `index.html`. */
export function extractedDistDir(): string | null {
  const root = join(REPO_ROOT, "sandustry");
  if (!existsSync(root)) return null;
  const candidates = readdirSync(root)
    .map((name) => join(root, name, "dist"))
    .filter((dist) => existsSync(join(dist, "index.html")));
  if (candidates.length === 0) return null;
  candidates.sort(
    (a, b) => statSync(join(b, "index.html")).mtimeMs - statSync(join(a, "index.html")).mtimeMs,
  );
  return candidates[0];
}
