/**
 * Shared `sandkit.api.maps` base — active custom map metadata.
 *
 * @internal Base namespace reused by main and worker declarations.
 */
export namespace maps {
  /** Currently loaded map definition, or null outside custom maps. */
  export function getActive(): Readonly<ActiveMapV1> | null;
  /** Opaque active map record (version 1 schema). */
  export type ActiveMapV1 = unknown
}
