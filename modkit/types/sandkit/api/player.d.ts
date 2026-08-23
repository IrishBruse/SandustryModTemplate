/**
 * Player position, movement, inventory, and building unlocks.
 *
 * Available as `sandkit.api.player`.
 *
 * @module
 */
import { player as sharedPlayer } from "../../shared/api/player";

export namespace player {

  // Shared
  /** Return the player world position. */
  export import getWorldPosition = sharedPlayer.getWorldPosition
  /** Return true when the player overlaps the given cell. */
  export import isCollidingWithCell = sharedPlayer.isCollidingWithCell
  /** Return true when the player is within radius of the given cell. */
  export import isWithinRadiusOfCell = sharedPlayer.isWithinRadiusOfCell

  /** Set the player world position. */
  export function setWorldPosition(worldX: number, worldY: number): void;
  /** Set the player velocity. */
  export function setVelocity(velocityX: number, velocityY: number): void;
  /** Set the movement speed multiplier. */
  export function setMovementSpeedMultiplier(multiplier: number): void;
  /** Set movement mode to normal or hover. Return true when the mode changes. */
  export function setMovementMode(mode: 'normal' | 'hover'): boolean;
  /** Return true when the player is on ground. */
  export function isOnGround(): boolean;
  /** Move the player down until ground is found. */
  export function teleportToGround(): void;
  /** Return true when the world position has no collision. */
  export function isWorldPositionClear(worldX: number, worldY: number): boolean;

  /** Player inventory helpers. */
  export namespace inventory {
    /** Add an item to inventory by item id. */
    export function addFromId(itemId: string): void;
  }

  /** Player building unlock helpers. */
  export namespace buildings {
    /** Unlock a structure type for building. */
    export function unlockByType(structureId: string): void;
  }
}
