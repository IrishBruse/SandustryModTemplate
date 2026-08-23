import type { CellCoordinates, Vector2 } from "../../shared/player";

/**
 * Shared `sandkit.api.player` base — player position and collision queries.
 *
 * @internal Base namespace reused by main and worker declarations.
 */
export namespace player {
  /** Player center position in world pixels. */
  export function getWorldPosition(): Vector2;
  /** True when the player hitbox overlaps the cell. */
  export function isCollidingWithCell(...args: CellCoordinates): boolean;
  /** True when the player is within `radius` cells of the point. */
  export function isWithinRadiusOfCell(...args: [...CellCoordinates, radius: number]): boolean;
}
