/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Persistent and VFX lights
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiLights {
  persistent: ApiLightsPersistent;
  vfx: ApiLightsVfx;
}
export interface ApiLightsPersistent {
  /**
   * Create at world.
   * @param worldX World X coordinate.
   * @param worldY World Y coordinate.
   * @param options Optional settings object.
   */
  createAtWorld: (worldX: number, worldY: number, options?: PersistentLightOptions) => unknown;
  /**
   * fade At World.
   * @param worldX World X coordinate.
   * @param worldY World Y coordinate.
   * @param durationMs duration Ms.
   */
  fadeAtWorld: (worldX: number, worldY: number, durationMs?: number) => void;
  /** mark Dirty. */
  markDirty: () => void;
  /**
   * Remove at world.
   * @param worldX World X coordinate.
   * @param worldY World Y coordinate.
   */
  removeAtWorld: (worldX: number, worldY: number) => void;
}
export interface ApiLightsVfx {
  /**
   * Create at world.
   * @param worldX World X coordinate.
   * @param worldY World Y coordinate.
   * @param options Optional settings object.
   */
  createAtWorld: (worldX: number, worldY: number, options?: TemporaryLightOptions) => { index: number | null; };
  /**
   * Remove by id.
   * @param lightId light id.
   */
  removeById: (lightId: number) => void;
}
export type ApiLightsNamespace = ApiLights;
