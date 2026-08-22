import { onDispose } from "@modkit/debug";
import { DebugPanel } from "./DebugPanel";

/** Inject the F3 companion Debug panel (top left). */
export function installDebugToggle(api: SandkitApi, modId: string): void {
  const dispose = api.ui.inject(`${modId}:debug-panel`, () => <DebugPanel />);
  if (!dispose) {
    console.warn(`[${modId}] Debug panel UI registration failed`);
    return;
  }
  onDispose(dispose);
}
