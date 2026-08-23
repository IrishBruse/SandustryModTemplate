/**
 * Fluxite collection and energy updates.
 *
 * Available as `sandkit.api.resources`.
 *
 * @module
 */
import { CellCoordinates } from "../../shared/player";

export namespace resources {
  /**
   * Collect fluxite at the given cell.
   * @param cellX - Grid cell X coordinate.
   * @param cellY - Grid cell Y coordinate.
   */
  export function collectFluxiteAtCell(...args: CellCoordinates): void;
  /**
   * Update stored energy by amount with optional UI deferral.
   * @param amount - Energy delta (positive or negative).
   * @param options - When `deferUi` is true, skip immediate UI refresh.
   */
  export function updateEnergy(amount: number, options?: { deferUi?: boolean; }): void;
}
