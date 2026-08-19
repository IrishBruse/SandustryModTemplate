/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Cell reads, excavation, idle mutation
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiWorld {
  /**
   * Excavate terrain at a cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param outVelocity out Velocity.
   * @param damage damage.
   * @param options Optional settings object.
   */
  excavateAtCell: (cellX: number, cellY: number, outVelocity: { x: number; y: number; }, damage: number, options?: ExcavateOptions) => void;
  /**
   * Return cell id at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  getCellIdAtCell: (cellX: number, cellY: number) => number;
  /**
   * Return whether cell empty at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  isCellEmptyAtCell: (cellX: number, cellY: number) => boolean;
  /**
   * Return whether terrain at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  isTerrainAtCell: (cellX: number, cellY: number) => boolean;
  pickups: ApiWorldPickups;
  /**
   * Redraw cells around a position when idle.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param range range.
   */
  redrawAroundCellWhenIdle: (cellX: number, cellY: number, range: number) => void;
  /**
   * Report simulation activity at a cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  reportActivityAtCell: (cellX: number, cellY: number) => void;
  /**
   * Reveal fog at a cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  revealFogAtCell: (cellX: number, cellY: number) => void;
  /**
   * Run a callback when the simulation is idle.
   * @param callback Callback function.
   */
  runWhenSimulationIdle: (callback: () => void) => void;
}
export interface ApiWorldPickups {
  /** destroy. */
  destroy: (worldItem: unknown) => void;
  /** Return all. */
  getAll: () => unknown[];
  /**
   * Return by id.
   * @param worldItemId world Item id.
   */
  getById: (worldItemId: number) => unknown;
  /** Return boolean. */
  pickUp: (worldItem: unknown) => boolean;
  /**
   * Spawn at world.
   * @param worldX World X coordinate.
   * @param worldY World Y coordinate.
   */
  spawnAtWorld: (type: WorldItemType, worldX: number, worldY: number, data?: unknown, light?: WorldItemLight) => unknown;
}
export type ApiWorldNamespace = ApiWorld;
