import { installDebug as installModkitDebug } from "@modkit/debug";

export { isHotReloadEval, onDispose } from "@modkit/debug";

/** Mod debug entry — modkit helpers plus mod-specific dev setup. */
export function installDebug(api: SandkitApi, modId: string): void {
  installModkitDebug(api, modId);
}
