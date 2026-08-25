import { ModInspectorOverlay } from "./ModInspectorOverlay";
import { startPauseModsButton } from "./pause-mods-button";

/** Pause menu **Mods** row → blank Mod Inspector overlay. */
export function installModInspector(api: SandkitApi, modId: string): void {
  startPauseModsButton();

  const disposeUi = api.ui.inject(`${modId}:mod-inspector`, () => <ModInspectorOverlay />);
  if (!disposeUi) {
    console.warn("Mod Inspector overlay registration failed");
  }
}
