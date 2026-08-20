import type { SandkitApi } from "types/api";
import { installDebug as installFrameworkDebug } from "../../framework/debug";

export { isHotReloadEval, onDispose } from "../../framework/debug";

/** Mod debug entry — framework helpers plus mod-specific dev setup. */
export function installDebug(api: SandkitApi, modId: string): void {
  installFrameworkDebug(api, modId);
}
