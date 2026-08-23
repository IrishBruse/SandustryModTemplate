import { CellCoordinates } from "../../shared/player";

export namespace collector {
  export function getValueFromCellId(cellId: number): number;
  export function getValueByType(elementType: number): number;
  export function isCellIdCollectable(cellId: number): boolean;
  export function isCellIdCollectableForSprite(cellId: number): boolean;
  export function notifyPickupAtCell(...args: CellCoordinates): void;
}