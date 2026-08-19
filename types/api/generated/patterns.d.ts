/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Excavation patterns
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiPatterns {
  /**
   * Create circle.
   * @param size size.
   */
  createCircle: (size: number) => number[][];
  /**
   * Excavate terrain at a cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param pattern pattern.
   * @param outVelocity out Velocity.
   * @param power power.
   * @param options Optional settings object.
   */
  excavateAtCell: (cellX: number, cellY: number, pattern: number[][], outVelocity: { x: number; y: number; }, power: number, options?: PatternExcavateOptions) => void;
}
export type ApiPatternsNamespace = ApiPatterns;
