export namespace assets {
  export type AssetProviderV1 = {
    id: `${string}:${string}:${string}`,
    kind: string,
    localId?: string,
    modId?: number,
    modName: string,
  };
  export function getUrl(relativePath: string): string;
  export function getSelectedProvider(kind: string): AssetProviderV1 | null;
  export function selectProvider(kind: string, providerId: string | null): boolean;
}