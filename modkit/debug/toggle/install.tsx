import { onDispose } from "../hot-reload";
import { DebugToggleOverlay } from "./DebugToggleOverlay";

const INSTALL_KEY = "__modkitDebugToggleOwner";

type DebugToggleGlobals = typeof globalThis & { [INSTALL_KEY]?: string };

/** Inject the F3 / management Debug toggle UI (debug builds only). One row for all mods. */
export function installDebugToggle(api: SandkitApi, modId: string): void {
  const g = globalThis as DebugToggleGlobals;
  const owner = g[INSTALL_KEY];
  if (owner && owner !== modId) return;
  g[INSTALL_KEY] = modId;

  const dispose = api.ui.inject(`${modId}:debug-toggle`, () => (
    <DebugToggleOverlay modId={modId} />
  ));
  if (!dispose) {
    if (g[INSTALL_KEY] === modId) delete g[INSTALL_KEY];
    console.warn(`[${modId}] Debug toggle UI registration failed`);
    return;
  }
  onDispose(() => {
    dispose();
    if (g[INSTALL_KEY] === modId) delete g[INSTALL_KEY];
  });
}
