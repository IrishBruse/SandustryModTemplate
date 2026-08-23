import type { CellCoordinates, Vector2 } from "../../shared/player";

export namespace rendering {
  export function getDrawPositionAtCell(...args: CellCoordinates): Vector2;
  export function getGridMetrics(): { cellSize: number; snapGridCellSize: number; };
  export function getOverlayViewportSize(): { width: number; height: number; };
  export function withOverlayContext<T>(callback: (context: CanvasRenderingContext2D) => T): T;
}