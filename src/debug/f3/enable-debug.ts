import { safe } from "@modkit/utils";
import { settingOn } from "../boot/settings";

type DebugConfigRoot = {
  debug: Record<string, unknown>;
};

function configRoot(api: SandkitApi): DebugConfigRoot | null {
  const all = safe(() => api.gameConfig.getAll());
  if (!all || typeof all !== "object") return null;
  const debug = (all as { debug?: unknown }).debug;
  if (!debug || typeof debug !== "object") return null;
  return all as DebugConfigRoot;
}

/**
 * Keep engine `debug.active` in sync with the **Engine debug** setting.
 * Boot localStorage is updated so the next launch matches.
 */
export function syncEngineDebug(api: SandkitApi): void {
  const on = settingOn(api, "engineDebug");

  safe(() => {
    localStorage.setItem("debug.active", String(on));
    return true;
  });

  const config = configRoot(api);
  if (!config) return;
  safe(() => {
    config.debug.active = on;
    return true;
  });
}
