import { isEnabled, safe } from "@modkit/utils";

/**
 * Defaults when `api.settings.get` has no boolean yet.
 * Keep in sync with `configSchema` in `./mod.ts`.
 */
const SETTING_DEFAULTS: Record<string, boolean> = {
  openDevTools: false,
  f12DevTools: true,
  skipSplash: false,
  autoBoot: false,
  engineDebug: true,
};

function boolSetting(api: SandkitApi, key: string): boolean {
  const value = safe(() => api.settings.get(key));
  if (typeof value === "boolean") return value;
  return SETTING_DEFAULTS[key] ?? false;
}

/** True when the master switch and this key are on. */
export function settingOn(api: SandkitApi, key: string): boolean {
  return isEnabled(api) && boolSetting(api, key);
}
