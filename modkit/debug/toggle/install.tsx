import type { SandkitApi } from "types/api";
import { onDispose } from "../hot-reload";
import { DebugToggleOverlay } from "./DebugToggleOverlay";

/** Inject the F3 / management Debug toggle UI (debug builds only). */
export function installDebugToggle(api: SandkitApi, modId: string): void {
  const dispose = api.ui.inject(`${modId}:debug-toggle`, () => (
    <DebugToggleOverlay modId={modId} />
  ));
  if (!dispose) {
    console.warn(`[${modId}] Debug toggle UI registration failed`);
    return;
  }
  onDispose(dispose);
}
