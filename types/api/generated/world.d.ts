/**
 * Auto-generated from sandkit-api/runtime-dump.json
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
  excavateAtCell: (cellX: number, cellY: number, outVelocity: number, damage: number, options: Record<string, unknown>) => void;
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
  runWhenSimulationIdle: (callback: (...args: unknown[]) => unknown) => void;
}
export interface ApiWorldPickups {
  /** destroy. */
  destroy: (worldItem: Record<string, unknown>) => void;
  /** Return all. */
  getAll: () => Record<string, unknown>[];
  /**
   * Return by id.
   * @param worldItemId world Item id.
   */
  getById: (worldItemId: string) => Record<string, unknown> | undefined;
  /** Return boolean. */
  pickUp: (worldItem: Record<string, unknown>) => void;
  /**
   * Spawn at world.
   * @param worldX World X coordinate.
   * @param worldY World Y coordinate.
   */
  spawnAtWorld: (type: string, worldX: number, worldY: number, data: Record<string, unknown>, light: Record<string, unknown> | undefined) => void;
}
export type ApiWorldNamespace = ApiWorld;
