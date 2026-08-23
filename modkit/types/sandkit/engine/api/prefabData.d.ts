/**
 * `sandkit.engine.api.prefabData` — prefab artifact and metadata lookup.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 *
 * @internal
 */
export namespace prefabData {
  /** Return all prefab data entries. */
  export function getAll(...args: unknown[]): unknown;
  /** Return metadata for all prefabs. */
  export function getAllMetadata(...args: unknown[]): unknown;
  /** Return artifact locations for prefabs. */
  export function getArtifactLocations(...args: unknown[]): unknown;
  /** Return prefab data at one grid cell. */
  export function getAtCell(...args: unknown[]): unknown;
  /** Return metadata for one prefab. */
  export function getMetadata(...args: unknown[]): unknown;
}
