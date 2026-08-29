import { ModInspectorOverlay } from "./ModInspectorOverlay";
import { startPauseModsButton } from "./pause-mods-button";

/**
 * Pause menu **Dev Tools** → panel on `document.body` above pause (`z > 10010`).
 * Main-menu **Mods** stays vanilla Workshop (`modsScreen`).
 */
export function installModInspector(api: SandkitApi, modId: string): void {
  startPauseModsButton();

  const disposeUi = api.ui.inject(`${modId}:mod-inspector`, () => <ModInspectorOverlay />);
  if (!disposeUi) {
    console.warn("Mod Inspector overlay registration failed");
  }
}
