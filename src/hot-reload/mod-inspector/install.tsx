import { onDispose } from "@modkit/debug";
import { ModInspectorOverlay } from "./ModInspectorOverlay";
import { startPauseModsButton } from "./pause-mods-button";
import { setModInspectorOpen } from "./state";

/** Pause menu **Mods** row → blank Mod Inspector overlay. */
export function installModInspector(api: SandkitApi, modId: string): void {
  onDispose(startPauseModsButton());
  onDispose(() => setModInspectorOpen(false));

  const disposeUi = api.ui.inject(`${modId}:mod-inspector`, () => <ModInspectorOverlay />);
  if (!disposeUi) {
    console.warn("Mod Inspector overlay registration failed");
    return;
  }
  onDispose(disposeUi);
}
