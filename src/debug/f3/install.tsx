import { onDispose } from "@modkit/debug";
import { registerF3Section } from "./registry";
import { registerBuiltinF3Sections } from "./sections";
import { syncEngineDebug } from "./enable-debug";
import { F3DebugOverlay } from "./F3DebugOverlay";

/** Keep engine `debug.active` on while the debug companion is enabled. */
function installEngineDebug(api: SandkitApi): void {
  syncEngineDebug(api);
  const stop = api.settings.onChange(() => syncEngineDebug(api));
  onDispose(stop);
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
    console.warn("F3 debug overlay registration failed");
    return;
  }
  onDispose(dispose);
}
