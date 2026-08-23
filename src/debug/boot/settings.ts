import { isEnabled, safe } from "@modkit/utils";

/**
 * Defaults when `api.settings.get` has no boolean yet.
 * Keep in sync with `configSchema` in `../mod.ts`.
 */
const SETTING_DEFAULTS: Record<string, boolean> = {
  openDevTools: false,
  f12DevTools: true,
  autoLoad: true,
  engineDebug: true,
  disableAutosave: true,
  watchLocalMods: true,
};

export type HotReloadFallback = "off" | "toast" | "reload";

const FALLBACK_DEFAULT: HotReloadFallback = "toast";

function boolSetting(api: SandkitApi, key: string): boolean {
  const value = safe(() => api.settings.get(key));
  if (typeof value === "boolean") return value;
  return SETTING_DEFAULTS[key] ?? false;
}

/** True when the master switch and this key are on. */
export function settingOn(api: SandkitApi, key: string): boolean {
  return isEnabled(api) && boolSetting(api, key);
}

/**
 * Auto-load last save. Honours legacy `autoBoot` when `autoLoad` is not stored yet
 * (prefs from before splash/Continue helpers were replaced).
 */
export function autoLoadOn(api: SandkitApi): boolean {
  if (!isEnabled(api)) return false;
  const autoLoad = safe(() => api.settings.get("autoLoad"));
  if (typeof autoLoad === "boolean") return autoLoad;
  const legacy = safe(() => api.settings.get("autoBoot"));
  if (typeof legacy === "boolean") return legacy;
  return SETTING_DEFAULTS.autoLoad;
}

/** When `main.js` changed but hot eval is not safe. */
export function hotReloadFallback(api: SandkitApi): HotReloadFallback {
  if (!isEnabled(api)) return FALLBACK_DEFAULT;
  const value = safe(() => api.settings.get("hotReloadFallback"));
  if (value === "off" || value === "toast" || value === "reload") return value;
  return FALLBACK_DEFAULT;
}
