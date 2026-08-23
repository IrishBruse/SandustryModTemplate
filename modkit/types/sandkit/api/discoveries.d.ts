/**
 * `sandkit.api.discoveries` — unlock element and terrain entries in the discovery log.
 * Main thread only.
 */
export namespace discoveries {
  /** Marks an element type as discovered for the player. */
  export function addElementByType(elementType: number): void;
  /** Marks a terrain type as discovered for the player. */
  export function addTerrainByType(terrainType: number): void;
}
