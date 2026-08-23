/**
 * Excavation patterns and cell-pattern helpers.
 *
 * Available as `sandkit.api.patterns`.
 *
 * @module
 */
import type { CellCoordinates, Vector2 } from "../../shared/player";
import type { shared } from "../../shared";

export namespace patterns {
  /**
   * Build a circular excavation pattern matrix for the given size.
   * @param size - Pattern width and height in cells.
   * @returns Square matrix with `1` inside the circle and `0` outside.
   */
  export function createCircle(size: number): number[][];

  /**
   * Excavate at a cell using a pattern matrix and output velocity.
   * @param cellX - Anchor cell column for the pattern.
   * @param cellY - Anchor cell row for the pattern.
   * @param pattern - Excavation pattern matrix.
   * @param outVelocity - Ejection velocity written into this vector.
   * @param power - Dig strength applied to matched cells.
   * @param options - Optional excavation source flags.
   */
  export function excavateAtCell(...args: [...CellCoordinates, pattern: number[][], outVelocity: Vector2, power: number, options?: PatternExcavateOptions]): void;

  /** Options for pattern-based excavation. Same shape as {@link shared.api.world.ExcavateOptions}. */
  export type PatternExcavateOptions = shared.api.world.ExcavateOptions;
}
