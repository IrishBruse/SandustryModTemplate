import { CellCoordinates } from "../../shared/player";

/**
 * `sandkit.api.collector` — collector structure value and pickup handling.
 * Main thread only.
 */
export namespace collector {
  /**
   * Returns the collector value for a cell id.
   * @param cellId - Packed cell identifier.
   */
  export function getValueFromCellId(cellId: number): number;
  /**
   * Returns the collector value for an element type.
   * @param elementType - Numeric element type id.
   */
  export function getValueByType(elementType: number): number;
  /**
   * Returns true when the cell id can be collected.
   * @param cellId - Packed cell identifier.
   */
  export function isCellIdCollectable(cellId: number): boolean;
  /**
   * Returns true when the cell id can be collected for sprite display.
   * @param cellId - Packed cell identifier.
   */
  export function isCellIdCollectableForSprite(cellId: number): boolean;
  /**
   * Notifies collector logic that a pickup happened at the cell.
   * @param cellX - Grid cell X coordinate.
   * @param cellY - Grid cell Y coordinate.
   */
  export function notifyPickupAtCell(...args: CellCoordinates): void;
}
