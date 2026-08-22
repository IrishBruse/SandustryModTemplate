import { onDispose } from "@modkit/debug";
import { DebugToggleOverlay } from "./DebugToggleOverlay";

/** Inject the F3 / management Debug toggle UI. */
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
