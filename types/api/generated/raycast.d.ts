/**
 * Auto-generated from sandkit-api/runtime-dump.json
 * Run: npm run generate-types
 * Ray casting
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiRaycast {
  /**
   * Return { x: number; y: number; distance: number; } | null.
   * @param startWorldX World X coordinate.
   * @param startWorldY World Y coordinate.
   * @param angle angle.
   * @param maxDistance max Distance.
   */
  castFromWorld: (startWorldX: number, startWorldY: number, angle: number, maxDistance: number) => void;
}
export type ApiRaycastNamespace = ApiRaycast;
