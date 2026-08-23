import type { assets } from "./assets";

/**
 * Mod asset provider lookup.
 *
 * Available as `sandkit.api.mods`.
 *
 * @module
 */
export namespace mods {
  /**
   * Return asset providers registered for a kind string.
   * @param kind - Asset kind identifier (e.g. texture pack category).
   */
  export function getProviders(kind: string): readonly AssetProviderV1[];
  /** Asset provider entry shape. */
  export type AssetProviderV1 = assets.AssetProviderV1
}
