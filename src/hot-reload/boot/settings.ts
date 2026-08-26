import { isEnabled } from "@modkit/utils";
import { SETTING_DEFAULTS } from "./setting-defaults.ts";

export { SETTING_DEFAULTS };

function boolSetting(api: SandkitApi, key: string): boolean {
  const value = api.settings.get(key);
  if (typeof value === "boolean") return value;
  return SETTING_DEFAULTS[key] ?? false;
}

/** True when the master switch and this key are on. */
export function settingOn(api: SandkitApi, key: string): boolean {
  return isEnabled(api) && boolSetting(api, key);
}

/**
 * F3 debug overlay. Honours legacy `engineDebug` when `f3Debug` is not stored yet.
 */
export function f3DebugOn(api: SandkitApi): boolean {
  if (!isEnabled(api)) return false;
  const f3Debug = api.settings.get("f3Debug");
  if (typeof f3Debug === "boolean") return f3Debug;
  const legacy = api.settings.get("engineDebug");
  if (typeof legacy === "boolean") return legacy;
  return SETTING_DEFAULTS.f3Debug;
}

/**
 * Auto-load last save. Honours legacy `autoBoot` when `autoLoad` is not stored yet
 * (prefs from before splash/Continue helpers were replaced).
 */
export function autoLoadOn(api: SandkitApi): boolean {
  if (!isEnabled(api)) return false;
  const autoLoad = api.settings.get("autoLoad");
  if (typeof autoLoad === "boolean") return autoLoad;
  const legacy = api.settings.get("autoBoot");
  if (typeof legacy === "boolean") return legacy;
  return SETTING_DEFAULTS.autoLoad;
}
