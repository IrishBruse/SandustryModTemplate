import type { SandkitApi } from "types/api";
import { safe } from "../../sdk/safe";

/** Flags the game reads from localStorage while it boots. */
export const BOOT_FLAGS = ["active", "drawChunks"] as const;

export type DebugFlagEntry = {
  setting: string;
  flag: string;
  label: string;
};

/** Engine debug flags — same set as `references/uolkx-debug-toggle`. */
export const DEBUG_FLAGS: readonly DebugFlagEntry[] = [
  { setting: "debugActive", flag: "active", label: "Debug active" },
  { setting: "drawChunks", flag: "drawChunks", label: "Draw chunks" },
  { setting: "cellInspector", flag: "cellInspector", label: "Cell inspector" },
  { setting: "showLights", flag: "showLights", label: "Show lights" },
  {
    setting: "showAuthorizationZones",
    flag: "showAuthorizationZones",
    label: "Authorization zones",
  },
  { setting: "showFilters", flag: "showFilters", label: "Show filters" },
  {
    setting: "doNotDrawStructures",
    flag: "doNotDrawStructures",
    label: "Hide structures",
  },
];

const PREF_PREFIX = "modkit.debugFlag.";

type DebugConfigRoot = {
  debug: Record<string, unknown>;
};

function settingBool(api: SandkitApi, name: string, fallback = false): boolean {
  const value = safe(() => api.settings.get(name));
  return typeof value === "boolean" ? value : fallback;
}

function prefKey(setting: string): string {
  return `${PREF_PREFIX}${setting}`;
}

/** Last settings-UI values so unrelated onChange events do not wipe panel prefs. */
const lastSettingsFlags: Record<string, boolean> = {};

/** Panel / storage preference, then mod setting, then fallback. */
export function readFlag(api: SandkitApi, setting: string, fallback = false): boolean {
  const stored = safe(() => api.storage.local.get(prefKey(setting)));
  if (typeof stored === "boolean") return stored;
  return settingBool(api, setting, fallback);
}

export function writeFlagPreference(api: SandkitApi, setting: string, value: boolean): void {
  safe(() => api.storage.local.set(prefKey(setting), value));
}

function configRoot(api: SandkitApi): DebugConfigRoot | null {
  const all = safe(() => api.gameConfig.getAll());
  if (!all || typeof all !== "object") return null;
  const debug = (all as { debug?: unknown }).debug;
  if (!debug || typeof debug !== "object") return null;
  return all as DebugConfigRoot;
}

/** Returns true when the value actually took effect in the live config. */
function writeLiveFlag(api: SandkitApi, flag: string, value: boolean): boolean {
  const config = configRoot(api);
  if (!config) return false;

  const applied = safe(() => {
    config.debug[flag] = value;
    return true;
  });
  if (!applied) return false;

  const check = configRoot(api);
  return !!check && check.debug[flag] === value;
}

function writeBootFlag(flag: string, value: boolean): boolean {
  return !!safe(() => {
    localStorage.setItem(`debug.${flag}`, String(value));
    return true;
  });
}

/** Boot flag values as they were when first applied this session. */
const bootSnapshot: Record<string, boolean> = {};

/**
 * Apply every debug flag from preferences / settings into live config
 * (and boot localStorage for boot flags).
 */
export function applyAllFlags(api: SandkitApi, announce: boolean): void {
  let restartFlags = 0;
  let appliedLive = 0;

  for (const entry of DEBUG_FLAGS) {
    const value = readFlag(api, entry.setting, false);
    const isBootFlag = (BOOT_FLAGS as readonly string[]).includes(entry.flag);

    if (isBootFlag) {
      writeBootFlag(entry.flag, value);
      if (!(entry.flag in bootSnapshot)) bootSnapshot[entry.flag] = value;
      else if (bootSnapshot[entry.flag] !== value) restartFlags++;
    }

    if (writeLiveFlag(api, entry.flag, value)) appliedLive++;
  }

  if (!announce) return;

  if (restartFlags > 0) {
    safe(() => api.ui.toast("Saved - restart the game for debug mode to change"));
  } else if (appliedLive > 0) {
    safe(() => api.ui.toast("Debug settings applied"));
  } else {
    safe(() => api.ui.toast("Debug settings saved (restart may be required)"));
  }
}

/** Seed prefs from settings when missing, then apply (startup). */
export function initFlagsFromSettings(api: SandkitApi): void {
  for (const entry of DEBUG_FLAGS) {
    const fromSettings = settingBool(api, entry.setting, false);
    lastSettingsFlags[entry.setting] = fromSettings;
    const stored = safe(() => api.storage.local.get(prefKey(entry.setting)));
    if (typeof stored !== "boolean") {
      writeFlagPreference(api, entry.setting, fromSettings);
    }
  }
  applyAllFlags(api, false);
}

/**
 * When the mod settings UI changes a flag, copy it into prefs and apply.
 * Ignores onChange events that did not change a flag value.
 */
export function onDebugSettingsChange(
  api: SandkitApi,
  values: Readonly<Record<string, unknown>>,
  announce: boolean,
): void {
  let flagsChanged = false;
  for (const entry of DEBUG_FLAGS) {
    const value = values[entry.setting];
    if (typeof value !== "boolean") continue;
    if (lastSettingsFlags[entry.setting] === value) continue;
    lastSettingsFlags[entry.setting] = value;
    writeFlagPreference(api, entry.setting, value);
    flagsChanged = true;
  }
  if (flagsChanged) applyAllFlags(api, announce);
}

/** Toggle one flag from the F3 panel and apply immediately. */
export function setFlag(api: SandkitApi, setting: string, value: boolean, announce = true): void {
  writeFlagPreference(api, setting, value);
  applyAllFlags(api, announce);
}

export function debugMenuButtonEnabled(api: SandkitApi): boolean {
  return settingBool(api, "debugMenuButton", true);
}
