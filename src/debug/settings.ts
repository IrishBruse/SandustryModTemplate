import { isEnabled, safe } from "@modkit/utils";

function boolSetting(api: SandkitApi, key: string): boolean {
  const value = safe(() => api.settings.get(key));
  return typeof value === "boolean" ? value : true;
}

/** True when the master switch and this key are on (missing key defaults to on). */
export function settingOn(api: SandkitApi, key: string): boolean {
  return isEnabled(api) && boolSetting(api, key);
}
