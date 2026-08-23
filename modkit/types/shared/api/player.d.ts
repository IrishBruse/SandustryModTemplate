import type { CellCoordinates, Vector2 } from "../../shared/player";

export namespace player {
  export function getWorldPosition(): Vector2;
  export function isCollidingWithCell(...args: CellCoordinates): boolean;
  export function isWithinRadiusOfCell(...args: [...CellCoordinates, radius: number]): boolean;
}
