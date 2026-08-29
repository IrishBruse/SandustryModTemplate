/**
 * Browser-bundle stub for `@modkit/patches`. Real payloads load at build time only.
 */
export function definePatches<const T extends readonly unknown[]>(patches: T): T {
  return patches;
}

/** Empty stand-in for `modkitDebugPatches`. */
export const modkitDebugPatches = definePatches([]);
