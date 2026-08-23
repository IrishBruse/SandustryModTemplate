/**
 * Mod asset provider lookup.
 *
 * Available as `sandkit.api.mods`.
 *
 * @module
 */
export namespace mods {
  /** Return asset providers registered for a kind string. */
  export function getProviders(kind: string): readonly AssetProviderV1[];
  /** Asset provider entry shape. */
  export type AssetProviderV1 = unknown
}
