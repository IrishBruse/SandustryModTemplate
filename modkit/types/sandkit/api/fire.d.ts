import { CellCoordinates } from "../../shared/player";

/**
 * `sandkit.api.fire` — ignite and burn elements at grid cells.
 * Main thread only.
 */
export namespace fire {
  /**
   * Returns true when the element at the cell can burn.
   * @param cellX - Grid cell X coordinate.
   * @param cellY - Grid cell Y coordinate.
   */
  export function canBurnElementAtCell(...args: CellCoordinates): boolean;
  /**
   * Queues a burn at the cell when the simulation is idle.
   * @param cellX - Grid cell X coordinate.
   * @param cellY - Grid cell Y coordinate.
   */
  export function burnElementAtCellWhenIdle(...args: CellCoordinates): void;
  /**
   * Burns the element at the cell immediately. Returns true on success.
   * @param cellX - Grid cell X coordinate.
   * @param cellY - Grid cell Y coordinate.
   */
  export function burnElementAtCell(...args: CellCoordinates): boolean;
}
