import type { ModManifest } from "@framework/types/manifest";

/** Type-safe mod manifest builder — use in `mod.ts` instead of `satisfies ModManifest`. */
export function defineMod<const T extends ModManifest>(manifest: T): T {
  return manifest;
}
