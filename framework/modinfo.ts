import type { ModManifest } from "@framework/types/manifest";
import type { Patch } from "@framework/types/patch";

/** Type-safe mod manifest builder — use in `mod.ts`. */
export function defineModInfo<const T extends ModManifest>(manifest: T): T {
  return manifest;
}

/** Type-safe patch list builder — use in `patches.ts`. Writes to `patches.json` at build. */
export function definePatches<const T extends readonly Patch[]>(patches: T): T {
  return patches;
}
