/**
 * `sandkit.api.assets` — mod asset URLs and asset provider selection.
 * Main thread only.
 */
export namespace assets {
  /** Describes a mod or pack that supplies assets for a kind. */
  export type AssetProviderV1 = {
    id: `${string}:${string}:${string}`,
    kind: string,
    localId?: string,
    modId?: number,
    modName: string,
  };
  /** Resolves a path under the mod folder to a loadable URL. */
  export function getUrl(relativePath: string): string;
  /** Returns the selected provider for an asset kind, or null. */
  export function getSelectedProvider(kind: string): AssetProviderV1 | null;
  /** Selects a provider for an asset kind. Returns true on success. */
  export function selectProvider(kind: string, providerId: string | null): boolean;
}
