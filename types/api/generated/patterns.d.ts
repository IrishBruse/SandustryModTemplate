/**
 * Auto-generated from sandkit-api/runtime-dump.json
 * Run: npm run generate-types
 * Excavation patterns
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiPatterns {
  /**
   * Create circle.
   * @param size size.
   */
  createCircle: (size: number) => { x: number; y: number }[];
  /**
   * Excavate terrain at a cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param pattern pattern.
   * @param outVelocity out Velocity.
   * @param power power.
   * @param options Optional settings object.
   */
  excavateAtCell: (cellX: number, cellY: number, pattern: Record<string, unknown>, outVelocity: number, power: number, options: Record<string, unknown>) => void;
}
export type ApiPatternsNamespace = ApiPatterns;
