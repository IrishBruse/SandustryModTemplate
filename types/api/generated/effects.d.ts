/**
 * Auto-generated from types/api/source/runtime-dump.json
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
  createDistortionWaveAtWorld: (worldX: number, worldY: number, options?: { style?: 'implode' | 'explode'; duration?: number; maxRadius?: number; intensity?: number; color?: [number, number, number, number]; }) => void;
  /**
   * Create effect at world.
   * @param effectId effect id.
   * @param worldX World X coordinate.
   * @param worldY World Y coordinate.
   * @param options Optional settings object.
   */
  createEffectAtWorld: (effectId: string, worldX: number, worldY: number, options?: unknown) => void;
  /**
   * Create laser at world.
   * @param startWorldX World X coordinate.
   * @param startWorldY World Y coordinate.
   * @param endWorldX World X coordinate.
   * @param endWorldY World Y coordinate.
   * @param options Optional settings object.
   */
  createLaserAtWorld: (startWorldX: number, startWorldY: number, endWorldX: number, endWorldY: number, options?: { width?: number; brightness?: number; color?: number; glow?: boolean; }) => unknown;
  /**
   * Create light at world.
   * @param worldX World X coordinate.
   * @param worldY World Y coordinate.
   * @param options Optional settings object.
   */
  createLightAtWorld: (worldX: number, worldY: number, options?: TemporaryLightOptions) => { index: number | null; };
  /**
   * Create particles at world.
   * @param worldX World X coordinate.
   * @param worldY World Y coordinate.
   * @param options Optional settings object.
   */
  createParticlesAtWorld: (worldX: number, worldY: number, options?: ParticleEffectOptions) => void;
  /**
   * Remove light by id.
   * @param lightId light id.
   */
  removeLightById: (lightId: number) => void;
}
export type ApiEffectsNamespace = ApiEffects;
