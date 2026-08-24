/**
 * Player position, movement, inventory, and building unlocks.
 *
 * Available as `sandkit.api.player`.
 *
 * @module
 */
import { shared } from "../../shared";

export namespace player {

  // Shared
  /** Return the player world position. */
  export import getWorldPosition = shared.api.player.getWorldPosition
  /** Return true when the player overlaps the given cell. */
  export import isCollidingWithCell = shared.api.player.isCollidingWithCell
  /** Return true when the player is within radius of the given cell. */
  export import isWithinRadiusOfCell = shared.api.player.isWithinRadiusOfCell

  /**
   * Set the player world position.
   * @param worldX - World x position in pixels.
   * @param worldY - World y position in pixels.
   */
  export function setWorldPosition(worldX: number, worldY: number): void;

  /**
   * Set the player velocity.
   * @param velocityX - Horizontal velocity in pixels per second.
   * @param velocityY - Vertical velocity in pixels per second.
   */
  export function setVelocity(velocityX: number, velocityY: number): void;

  /**
   * Set the movement speed multiplier.
   * @param multiplier - Speed scale factor (`1` is default walk). `0` freezes movement.
   * Vanilla Sprint Boost (Shift burst + meter) only runs when this value is exactly `1`.
   */
  export function setMovementSpeedMultiplier(multiplier: number): void;

  /**
   * Set movement mode to normal or hover.
   * @param mode - `"normal"` for default physics, or `"hover"` for hover flight.
   * @returns True when the mode changes.
   */
  export function setMovementMode(mode: 'normal' | 'hover'): boolean;

  /**
   * Return true when the player is on ground.
   * @returns True when the player touches solid ground.
   */
  export function isOnGround(): boolean;

  /** Move the player down until ground is found. */
  export function teleportToGround(): void;

  /**
   * Return true when the world position has no collision.
   * @param worldX - World x position in pixels to test.
   * @param worldY - World y position in pixels to test.
   * @returns True when the player hitbox fits at the position.
   */
  export function isWorldPositionClear(worldX: number, worldY: number): boolean;

  /** Player inventory helpers. */
  export namespace inventory {
    /**
     * Add an item to inventory by item id.
     * @param itemId - Registered item id string.
     */
    export function addFromId(itemId: string): void;
  }

  /** Player building unlock helpers. */
  export namespace buildings {
    /**
     * Unlock a structure type for building.
     * @param structureId - Registered structure id string.
     */
    export function unlockByType(structureId: string): void;
  }
}
