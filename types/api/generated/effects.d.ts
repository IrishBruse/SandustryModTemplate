/**
 * Auto-generated from sandkit-api/runtime-dump.json
 * Run: npm run generate-types
 * Particles, lights, lasers
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiEffects {
  /**
   * Create distortion wave at world.
   * @param worldX World X coordinate.
   * @param worldY World Y coordinate.
   * @param options Optional settings object.
   */
  createDistortionWaveAtWorld: (worldX: number, worldY: number, options: Record<string, unknown>) => void;
  /**
   * Create effect at world.
   * @param effectId effect id.
   * @param worldX World X coordinate.
   * @param worldY World Y coordinate.
   * @param options Optional settings object.
   */
  createEffectAtWorld: (effectId: string, worldX: number, worldY: number, options: Record<string, unknown>) => void;
  /**
   * Create laser at world.
   * @param startWorldX World X coordinate.
   * @param startWorldY World Y coordinate.
   * @param endWorldX World X coordinate.
   * @param endWorldY World Y coordinate.
   * @param options Optional settings object.
   */
  createLaserAtWorld: (startWorldX: number, startWorldY: number, endWorldX: number, endWorldY: number, options: Record<string, unknown>) => void;
  /**
   * Create light at world.
   * @param worldX World X coordinate.
   * @param worldY World Y coordinate.
   * @param options Optional settings object.
   */
  createLightAtWorld: (worldX: number, worldY: number, options: Record<string, unknown>) => void;
  /**
   * Create particles at world.
   * @param worldX World X coordinate.
   * @param worldY World Y coordinate.
   * @param options Optional settings object.
   */
  createParticlesAtWorld: (worldX: number, worldY: number, options: Record<string, unknown>) => void;
  /**
   * Remove light by id.
   * @param lightId light id.
   */
  removeLightById: (lightId: string) => void;
}
export type ApiEffectsNamespace = ApiEffects;
