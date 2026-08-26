import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

/** Isolated Electron user-data for live tests. Not the Steam profile. */
export const SANDUSTRY_TEST_CDP_PORT = "9223";

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

/** Installed renderer entry in the test user-data mods folder. */
export function installedModMain(modId: string): string {
  return join(sandustryTestModsDir(), modId, "main.js");
}

export function tryReadInstalledModMain(modId: string): string | null {
  try {
    return readFileSync(installedModMain(modId), "utf8");
  } catch {
    return null;
  }
}
