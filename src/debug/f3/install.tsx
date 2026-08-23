import { onDispose } from "@modkit/debug";
import { safe } from "@modkit/utils";
import { registerF3Section } from "./registry";
import { registerBuiltinF3Sections } from "./sections";
import { syncEngineDebug } from "./enable-debug";
import { F3DebugOverlay } from "./F3DebugOverlay";

/** Keep engine `debug.active` in sync with the **Engine debug** setting. */
function installEngineDebug(api: SandkitApi): void {
  syncEngineDebug(api);
  const stop = safe(() => api.settings.onChange(() => syncEngineDebug(api)));
  if (stop) onDispose(stop);
}

/** F3 overlay, built-in sections, and DevTools console hook for extensions. */
export function installDebugCompanion(api: SandkitApi, modId: string): void {
  installEngineDebug(api);

  onDispose(registerBuiltinF3Sections());

  Object.assign(globalThis, {
    debugF3: { registerSection: registerF3Section },
  });

  const dispose = api.ui.inject(`${modId}:f3-debug`, () => <F3DebugOverlay />);
  if (!dispose) {
    console.warn(`[${modId}] F3 debug overlay registration failed`);
    return;
  }
  onDispose(dispose);
}
