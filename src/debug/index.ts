import type { SandkitApi } from "types/api";
import { registerDevToolsShortcut, scheduleMainMenuBoot } from "./boot-menu";

/** DevTools, splash skip, and main-menu auto-boot (controlled by mod debug setting). */
export function installDebug(api: SandkitApi): void {
  registerDevToolsShortcut();
  scheduleMainMenuBoot(api);
}
