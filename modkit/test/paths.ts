import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

/** Electron user-data root for Sandustry. */
export function sandustryUserDataDir(): string {
  if (process.platform === "win32") {
    const appData = process.env.APPDATA || join(homedir(), "AppData", "Roaming");
    return join(appData, "sandustry");
  }
  return join(homedir(), ".config", "sandustry");
}

export function sandustryModsDir(): string {
  return join(sandustryUserDataDir(), "mods");
}

/** Installed renderer entry for a mod id (`main.js` in the OS mods folder). */
export function installedModMain(modId: string): string {
  return join(sandustryModsDir(), modId, "main.js");
}

export function tryReadInstalledModMain(modId: string): string | null {
  try {
    return readFileSync(installedModMain(modId), "utf8");
  } catch {
    return null;
  }
}
