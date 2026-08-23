import type { CellCoordinates, Vector2 } from "../../shared/player";

/**
 * Shared `sandkit.api.player` base — player position and collision queries.
 *
 * @internal Base namespace reused by main and worker declarations.
 */
export namespace player {
  /**
   * Return the player center position in world pixels.
   * @returns World position as `{ x, y }` in pixels.
   */
  export function getWorldPosition(): Vector2;

  /**
   * Return true when the player hitbox overlaps the cell.
   * @param cellX - Grid column of the cell.
   * @param cellY - Grid row of the cell.
   * @returns True when the player overlaps the cell.
   */
  export function isCollidingWithCell(...args: CellCoordinates): boolean;

  /**
   * Return true when the player is within `radius` cells of the point.
   * @param cellX - Grid column of the reference cell.
   * @param cellY - Grid row of the reference cell.
   * @param radius - Maximum distance in cells (inclusive).
   * @returns True when the player is inside the radius.
   */
  export function isWithinRadiusOfCell(...args: [...CellCoordinates, radius: number]): boolean;
}
