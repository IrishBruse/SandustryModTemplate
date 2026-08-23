/**
 * `sandkit.engine.api.prefabData` — prefab artifact and metadata lookup.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 * Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.
 *
 * @internal
 */
export namespace prefabData {
  /**
   * Return all prefab data entries.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getAll(...args: unknown[]): unknown;
  /**
   * Return metadata for all prefabs.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getAllMetadata(...args: unknown[]): unknown;
  /**
   * Return artifact locations for prefabs.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getArtifactLocations(...args: unknown[]): unknown;
  /**
   * Return prefab data at one grid cell.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getAtCell(...args: unknown[]): unknown;
  /**
   * Return metadata for one prefab.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getMetadata(...args: unknown[]): unknown;
}
