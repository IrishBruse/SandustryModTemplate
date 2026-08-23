import type { Vector2 } from "../../shared/player";

/**
 * Shared `sandkit.api.effects` base — world-space visual effects.
 *
 * Main thread may expose additional effect helpers. Workers use this subset.
 *
 * @internal Base namespace reused by main and worker declarations.
 */
export namespace effects {
  /**
   * Spawn a temporary light at world coordinates.
   * @param worldX - World x position in pixels.
   * @param worldY - World y position in pixels.
   * @param options - Brightness, colour, and lifetime settings.
   */
  export function createLightAtWorld(worldX: number, worldY: number, options?: TemporaryLightOptions): { index: number | null; };
  /**
   * Emit particles at world coordinates.
   * @param worldX - World x position in pixels.
   * @param worldY - World y position in pixels.
   * @param options - Count, velocity, colour, and lifetime settings.
   */
  export function createParticlesAtWorld(worldX: number, worldY: number, options?: ParticleEffectOptions): void;
  /**
   * Spawn a named screen-space or world effect.
   * @param effectId - Registered effect id (for example `heatWave`).
   * @param worldX - World x position in pixels.
   * @param worldY - World y position in pixels.
   * @param options - Duration, radius, and intensity settings.
   */
  export function createEffectAtWorld(effectId: "heatWave", worldX: number, worldY: number, options?: EffectOptions): void;

  /** Generic duration and radius options for world effects. */
  export interface EffectOptions {
    duration?: number,
    maxRadius?: number,
    intensity?: number,
  }
  /** Options for {@link createLightAtWorld}. */
  export interface TemporaryLightOptions {
    brightness?: number,
    duration?: number,
    durationMs?: number,
    size?: number,
    color?: [number, number, number, number],
    /** Light decay rate after spawn. */
    decay: number,
    unclamped?: boolean,
    skipDedup?: boolean,
    useLightZones?: boolean,
    noopIfFull?: boolean,
    priority?: number,
    /** Dedupe key when the light pool is full or dedup is enabled. */
    dedupKey: string,
  }
  /** Options for {@link createParticlesAtWorld}. */
  export interface ParticleEffectOptions {
    count?: number,
    velocity?: Vector2,
    minSpeed?: number,
    maxSpeed?: number,
    /** Hex code. No alpha. */
    color?: number,
    minSize?: number,
    maxSize?: number,
    minLifetime?: number,
    maxLifetime?: number,
    background?: boolean,
    imageName?: string,
    fadeOutOnly?: boolean,
    fadeStart?: number,
    fadeEnd?: number,
    damp?: number,
  }
}
