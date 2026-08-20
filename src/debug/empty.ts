import type { SandkitApi } from "types/api";

/** Release-build stub — dev builds use index.ts instead (via esbuild). */
export function installDebug(_api: SandkitApi, _modId: string): void {}

export function onDispose(_fn: () => void): () => void {
  return () => {};
}

export function isHotReloadEval(_modId: string): boolean {
  return false;
}
