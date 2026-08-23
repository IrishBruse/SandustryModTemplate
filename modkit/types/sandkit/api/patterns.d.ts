/**
 * Excavation patterns and cell-pattern helpers.
 *
 * Available as `sandkit.api.patterns`.
 *
 * @module
 */
import type { CellCoordinates, Vector2 } from "../../shared/player";
export namespace patterns {
  /** Build a circular excavation pattern matrix for the given size. */
  export function createCircle(size: number): number[][];
  /** Excavate at a cell using a pattern matrix and output velocity. */
  export function excavateAtCell(...args: [...CellCoordinates, pattern: number[][], outVelocity: Vector2, power: number, options?: PatternExcavateOptions]): void;

  /** Options for pattern-based excavation. */
  export type PatternExcavateOptions = unknown
}
