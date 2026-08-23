import type { CellCoordinates, Vector2 } from "../../shared/player";

/**
 * Shared `sandkit.api.world` base — cell and terrain queries plus excavation.
 *
 * Main thread adds idle scheduling and fog helpers on top of this shape.
 *
 * @internal Base namespace reused by main and worker declarations.
 */
export namespace world {
  /** Packed cell id at grid coordinates. */
  export function getCellIdAtCell(...args: CellCoordinates): number;
  /** True when the cell has no element or terrain content. */
  export function isCellEmptyAtCell(...args: CellCoordinates): boolean;
  /** True when the cell holds terrain (not an element). */
  export function isTerrainAtCell(...args: CellCoordinates): boolean;
  /** Mark the cell active for simulation this tick. */
  export function reportActivityAtCell(...args: CellCoordinates): void;
  /** Apply excavation damage and eject velocity at a cell. */
  export function excavateAtCell(...args: [...CellCoordinates, outVelocity: Vector2, damage: number, options?: ExcavateOptions]): void;

  /** Options bag for {@link excavateAtCell}. */
  export type ExcavateOptions = unknown
}
