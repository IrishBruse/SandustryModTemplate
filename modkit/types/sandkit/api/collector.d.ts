import { CellCoordinates } from "../../shared/player";

/**
 * `sandkit.api.collector` — collector structure value and pickup handling.
 * Main thread only.
 */
export namespace collector {
  /** Returns the collector value for a cell id. */
  export function getValueFromCellId(cellId: number): number;
  /** Returns the collector value for an element type. */
  export function getValueByType(elementType: number): number;
  /** Returns true when the cell id can be collected. */
  export function isCellIdCollectable(cellId: number): boolean;
  /** Returns true when the cell id can be collected for sprite display. */
  export function isCellIdCollectableForSprite(cellId: number): boolean;
  /** Notifies collector logic that a pickup happened at the cell. */
  export function notifyPickupAtCell(...args: CellCoordinates): void;
}
