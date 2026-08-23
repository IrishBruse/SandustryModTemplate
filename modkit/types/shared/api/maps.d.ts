/**
 * Shared `sandkit.api.maps` base — active custom map metadata.
 *
 * @internal Base namespace reused by main and worker declarations.
 */
export namespace maps {
  /**
   * Return the currently loaded custom map definition.
   * @returns Active map metadata, or `null` outside custom maps.
   */
  export function getActive(): Readonly<ActiveMapV1> | null;

  /**
   * Active custom map record (version 1 schema).
   *
   * Shape varies by map. Known fields are optional; additional keys may exist.
   */
  export interface ActiveMapV1 {
    id?: string;
    deployment?: unknown;
    spawn?: unknown;
    topBounds?: {
      soft?: number;
      hard?: number;
    };
    parallax?: unknown;
    depthLight?: unknown;
    [key: string]: unknown;
  }
}
