/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Player state
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiPlayer {
  buildings: ApiPlayerBuildings;
  /** Return world position. */
  getWorldPosition: () => { x: number; y: number; };
  inventory: ApiPlayerInventory;
  /**
   * Return whether colliding with cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  isCollidingWithCell: (cellX: number, cellY: number) => boolean;
  /** Return whether on ground. */
  isOnGround: () => boolean;
  /**
   * Return whether within radius of cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param radius radius.
   */
  isWithinRadiusOfCell: (cellX: number, cellY: number, radius: number) => boolean;
  /**
   * Return whether world position clear.
   * @param worldX World X coordinate.
   * @param worldY World Y coordinate.
   */
  isWorldPositionClear: (worldX: number, worldY: number) => boolean;
  /** Set movement mode. */
  setMovementMode: (mode: 'normal' | 'hover') => boolean;
  /**
   * Set movement speed multiplier.
   * @param multiplier multiplier.
   */
  setMovementSpeedMultiplier: (multiplier: number) => void;
  /**
   * Set velocity.
   * @param velocityX velocity X.
   * @param velocityY velocity Y.
   */
  setVelocity: (velocityX: number, velocityY: number) => void;
  /**
   * Set world position.
   * @param worldX World X coordinate.
   * @param worldY World Y coordinate.
   */
  setWorldPosition: (worldX: number, worldY: number) => void;
  /** Teleport the player or an element. */
  teleportToGround: () => void;
}
export interface ApiPlayerBuildings {
  /**
   * Unlock by type.
   * @param structureId structure id.
   */
  unlockByType: (structureId: string) => void;
}
export interface ApiPlayerInventory {
  /**
   * Add from id.
   * @param itemId item id.
   */
  addFromId: (itemId: string) => void;
}
export type ApiPlayerNamespace = ApiPlayer;
