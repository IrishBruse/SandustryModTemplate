import { shared } from "../../shared";

/**
 * `sandkit.api.effects` — visual effects, particles, lights, and lasers at world positions.
 * Main thread only.
 */
declare namespace effects {
  // Shared functions
  /** Creates a short-lived light at world coordinates. */
  export import createLightAtWorld = shared.api.effects.createLightAtWorld
  /** Spawns particles at world coordinates. */
  export import createParticlesAtWorld = shared.api.effects.createParticlesAtWorld
  /** Creates a named screen effect at world coordinates. */
  export import createEffectAtWorld = shared.api.effects.createEffectAtWorld
  // Shared types
  /** Options for generic screen effects. */
  export import EffectOptions = shared.api.effects.EffectOptions
  /** Options for temporary lights. */
  export import TemporaryLightOptions = shared.api.effects.TemporaryLightOptions
  /** Options for particle effects. */
  export import ParticleEffectOptions = shared.api.effects.ParticleEffectOptions

  /**
   * Creates a distortion wave effect at world coordinates.
   * @param worldX - World X coordinate in pixels.
   * @param worldY - World Y coordinate in pixels.
   * @param options - Style, duration, radius, intensity, and color.
   */
  export function createDistortionWaveAtWorld(worldX: number, worldY: number, options?: DistortionEffectOptions): void;
  /**
   * Creates a laser beam between two world points. Returns a handle to destroy it.
   * @param startWorldX - Beam start world X in pixels.
   * @param startWorldY - Beam start world Y in pixels.
   * @param endWorldX - Beam end world X in pixels.
   * @param endWorldY - Beam end world Y in pixels.
   * @param options - Width, brightness, color, and glow options.
   */
  export function createLaserAtWorld(startWorldX: number, startWorldY: number, endWorldX: number, endWorldY: number, options?: LaserEffectOptions): LaserEffectHandle;
  /**
   * Removes a temporary light by its id.
   * @param lightId - Light index from {@link createLightAtWorld}.
   */
  export function removeLightById(lightId: number): void;

  /** Options for laser beam effects. */
  export interface LaserEffectOptions {
    /** Beam width in pixels. */
    width?: number;
    /** Beam brightness multiplier. */
    brightness?: number;
    /** Beam color as a packed integer. */
    color?: number;
    /** When true, draws a glow around the beam. */
    glow?: boolean;
  }

  /** Handle returned by createLaserAtWorld. */
  export interface LaserEffectHandle {
    /** Removes the laser from the scene. */
    destroy(): void;
  }

  /** Options for distortion wave effects. */
  export interface DistortionEffectOptions {
    /** Distortion style: implode or explode. */
    style?: 'implode' | 'explode';
    /** Effect duration in seconds. */
    duration?: number;
    /** Maximum radius of the wave. */
    maxRadius?: number;
    /** Visual intensity of the distortion. */
    intensity?: number;
    /** RGBA color components for the effect. */
    color?: [number, number, number, number];
  }
}
