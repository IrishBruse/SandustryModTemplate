import { CellCoordinates } from "../../shared/player";

/**
 * `sandkit.api.grid` — iterate cells in rectangular and circular regions.
 * Main thread only.
 */
export namespace grid {
  /** Calls the callback for each cell in a rectangle. */
  export function forEachCellInRect(...args: [...CellCoordinates, width: number, height: number, callback: (...args: CellCoordinates) => void]): void;
  /** Calls the callback for each cell inside a circle. */
  export function forEachCellInCircle(centerCellX: number, centerCellY: number, radius: number, callback: (...args: CellCoordinates) => void): void;
}
