/**
 * Auto-generated from types/api/runtime-dump.json
 * Run: npm run generate-types
 * Player state
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ApiHandler, Method0, Method1, Method2, Method3, Method4, Method5, Method6 } from "../common";
export interface ApiPlayer {
  buildings: ApiPlayerBuildings;
  getWorldPosition: Method0;
  inventory: ApiPlayerInventory;
  isCollidingWithCell: Method2;
  isOnGround: Method0;
  isWithinRadiusOfCell: Method3;
  isWorldPositionClear: Method2;
  setMovementMode: Method1;
  setMovementSpeedMultiplier: Method1;
  setVelocity: Method2;
  setWorldPosition: Method2;
  teleportToGround: Method0;
}
export interface ApiPlayerBuildings {
  unlockByType: Method1;
}
export interface ApiPlayerInventory {
  addFromId: Method1;
}
export type ApiPlayerNamespace = ApiPlayer;
