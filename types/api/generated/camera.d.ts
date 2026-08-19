/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Focus and snap
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiCamera {
  /**
   * Return boolean.
   * @param options Optional settings object.
   */
  releaseFocus: (options?: { durationMs?: number; }) => boolean;
  /**
   * Set focus at world.
   * @param worldX World X coordinate.
   * @param worldY World Y coordinate.
   */
  setFocusAtWorld: (worldX: number, worldY: number) => boolean;
  /** snap To Player. */
  snapToPlayer: () => void;
}
export type ApiCameraNamespace = ApiCamera;
