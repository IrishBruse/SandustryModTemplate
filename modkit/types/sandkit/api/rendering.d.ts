/**
 * Screen-space drawing helpers and overlay canvas access.
 *
 * Available as `sandkit.api.rendering`.
 *
 * @module
 */
import type { CellCoordinates, Vector2 } from "../../shared/player";

export namespace rendering {
  /** Return screen draw position for a grid cell. */
  export function getDrawPositionAtCell(...args: CellCoordinates): Vector2;
  /** Return cell size and snap grid metrics. */
  export function getGridMetrics(): { cellSize: number; snapGridCellSize: number; };
  /** Return overlay viewport width and height in pixels. */
  export function getOverlayViewportSize(): { width: number; height: number; };
  /** Run a callback with the overlay canvas context. */
  export function withOverlayContext<T>(callback: (context: CanvasRenderingContext2D) => T): T;
}
