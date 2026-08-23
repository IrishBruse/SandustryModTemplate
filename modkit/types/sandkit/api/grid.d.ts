import { CellCoordinates } from "../../shared/player";

/**
 * `sandkit.api.grid` — iterate cells in rectangular and circular regions.
 * Main thread only.
 */
export namespace grid {
  /**
   * Calls the callback for each cell in a rectangle.
   * @param cellX - Origin cell column (top-left).
   * @param cellY - Origin cell row (top-left).
   * @param width - Rectangle width in cells.
   * @param height - Rectangle height in cells.
   * @param callback - Invoked for each cell with `(cellX, cellY)`.
   */
  export function forEachCellInRect(...args: [...CellCoordinates, width: number, height: number, callback: (...args: CellCoordinates) => void]): void;

  /**
   * Calls the callback for each cell inside a circle.
   * @param centerCellX - Circle center cell column.
   * @param centerCellY - Circle center cell row.
   * @param radius - Circle radius in cells.
   * @param callback - Invoked for each cell with `(cellX, cellY)`.
   */
  export function forEachCellInCircle(centerCellX: number, centerCellY: number, radius: number, callback: (...args: CellCoordinates) => void): void;
}
