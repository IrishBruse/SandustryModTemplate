/**
 * Browser-bundle stub for `@modkit/patches`.
 * Real patch payloads load only when building `patches.json`.
 */
export function definePatches<const T extends readonly unknown[]>(patches: T): T {
  return patches;
}

/** Empty stand-in for `modkitDebugPatches`. */
export const modkitDebugPatches = definePatches([]);
