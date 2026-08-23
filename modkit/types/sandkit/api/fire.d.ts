import { CellCoordinates } from "../../shared/player";

export namespace fire {
  export function canBurnElementAtCell(...args: CellCoordinates): boolean;
  export function burnElementAtCellWhenIdle(...args: CellCoordinates): void;
  export function burnElementAtCell(...args: CellCoordinates): boolean;
}