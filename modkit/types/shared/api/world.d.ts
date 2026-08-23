import type { CellCoordinates, Vector2 } from "../../shared/player";

export namespace world {
  export function getCellIdAtCell(...args: CellCoordinates): number;
  export function isCellEmptyAtCell(...args: CellCoordinates): boolean;
  export function isTerrainAtCell(...args: CellCoordinates): boolean;
  export function reportActivityAtCell(...args: CellCoordinates): void;
  export function excavateAtCell(...args: [...CellCoordinates, outVelocity: Vector2, damage: number, options?: ExcavateOptions]): void;

  export type ExcavateOptions = unknown
}