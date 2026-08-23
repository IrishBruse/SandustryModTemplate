import type { CellCoordinates, Vector2 } from "../../shared/player";
export namespace patterns {
  export function createCircle(size: number): number[][];
  export function excavateAtCell(...args: [...CellCoordinates, pattern: number[][], outVelocity: Vector2, power: number, options?: PatternExcavateOptions]): void;

  export type PatternExcavateOptions = unknown
}