/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Draw positions, overlay canvas
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiRendering {
  /**
   * Return draw position at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  getDrawPositionAtCell: (cellX: number, cellY: number) => { x: number; y: number };
  /** Return grid metrics. */
  getGridMetrics: () => Record<string, number>;
  /** Return overlay viewport size. */
  getOverlayViewportSize: () => { width: number; height: number };
  withOverlayContext: (draw: (ctx: CanvasRenderingContext2D) => void) => void;
}
export type ApiRenderingNamespace = ApiRendering;
