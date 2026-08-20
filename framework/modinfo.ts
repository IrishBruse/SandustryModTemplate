import type { ModManifest } from "types/framework/manifest";

/** Type-safe mod manifest builder — use in `modinfo.ts` instead of `satisfies ModManifest`. */
export function defineMod<const T extends ModManifest>(manifest: T): T {
  return manifest;
}
