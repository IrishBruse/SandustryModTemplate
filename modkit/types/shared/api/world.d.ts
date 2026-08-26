import type { CellCoordinates, Vector2 } from "../../shared/player";
import type { CellId as PackedCellId } from "../../nominal";

/**
 * Shared `sandkit.api.world` base — cell and terrain queries plus excavation.
 *
 * Main thread adds idle scheduling and fog helpers on top of this shape.
 *
 * @internal Base namespace reused by main and worker declarations.
 */
export namespace world {
  /**
   * Return the packed cell id at grid coordinates.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @returns Packed cell id for the cell.
   */
  export function getCellIdAtCell(...args: CellCoordinates): CellId;

  /**
   * Return true when the cell has no element or terrain content.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   */
  export function isCellEmptyAtCell(...args: CellCoordinates): boolean;

  /**
   * Return true when the cell holds terrain (not an element).
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   */
  export function isTerrainAtCell(...args: CellCoordinates): boolean;

  /**
   * Mark the cell active for simulation this tick.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   */
  export function reportActivityAtCell(...args: CellCoordinates): void;

  /**
   * Apply excavation damage and eject velocity at a cell.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @param outVelocity - Ejection velocity written into this vector.
   * @param damage - Damage applied to terrain in the pattern.
   * @param options - Optional excavation source flags.
   */
  export function excavateAtCell(...args: [...CellCoordinates, outVelocity: Vector2, damage: number, options?: ExcavateOptions]): void;

  /** Packed cell id from {@link getCellIdAtCell}. */
  export type CellId = PackedCellId;

  /** Flags that control how {@link excavateAtCell} resolves damage and drops. */
  export interface ExcavateOptions {
    /** Treat the dig as gun fire for terrain resistance checks. */
    fromGun?: boolean;
    /** Treat the dig as rocket or dynamite explosion damage. */
    fromRocketExplosion?: boolean;
    /** Treat the dig as drill damage. */
    fromDrill?: boolean;
    /** Use {@link outVelocity} literally instead of deriving ejection speed. */
    useLiteralOutVelocity?: boolean;
    /** Allow removing terrain marked non-destructible. */
    destroyNonDestructible?: boolean;
    /** Force-remove all matched cells regardless of normal rules. */
    forceRemoveAll?: boolean;
    /** Extra drill-tier damage when {@link fromDrill} is true. Clamped to 0–1000. */
    drillTierDamage?: number;
  }
}
