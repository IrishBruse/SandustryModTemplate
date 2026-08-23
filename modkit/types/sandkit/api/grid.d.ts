import { CellCoordinates } from "../../shared/player";

export namespace grid {
  export function forEachCellInRect(...args: [...CellCoordinates, width: number, height: number, callback: (...args: CellCoordinates) => void]): void;
  export function forEachCellInCircle(centerCellX: number, centerCellY: number, radius: number, callback: (...args: CellCoordinates) => void): void;
}