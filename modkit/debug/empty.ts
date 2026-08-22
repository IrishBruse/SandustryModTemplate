/** Release-build stub — debug builds use `index.ts` instead (via esbuild). */
export function installHotReload(_api: SandkitApi, _modId: string): void {}

export function onDispose(_fn: () => void): () => void {
  return () => {};
}

export function isHotReloadEval(_modId: string): boolean {
  return false;
}
