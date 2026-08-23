import { player as sharedPlayer } from "../../shared/api/player";

export namespace player {

  // Shared
  export import getWorldPosition = sharedPlayer.getWorldPosition
  export import isCollidingWithCell = sharedPlayer.isCollidingWithCell
  export import isWithinRadiusOfCell = sharedPlayer.isWithinRadiusOfCell


  export function setWorldPosition(worldX: number, worldY: number): void;
  export function setVelocity(velocityX: number, velocityY: number): void;
  export function setMovementSpeedMultiplier(multiplier: number): void;
  export function setMovementMode(mode: 'normal' | 'hover'): boolean;
  export function isOnGround(): boolean;
  export function teleportToGround(): void;
  export function isWorldPositionClear(worldX: number, worldY: number): boolean;

  export namespace inventory {
    export function addFromId(itemId: string): void;
  }

  export namespace buildings {
    export function unlockByType(structureId: string): void;
  }
}
