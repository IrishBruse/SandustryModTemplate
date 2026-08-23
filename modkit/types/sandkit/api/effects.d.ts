import { effects as sharedEffects } from "../../shared/api/effects";

/**
 * `sandkit.api.effects` — visual effects, particles, lights, and lasers at world positions.
 * Main thread only.
 */
declare namespace effects {
  // Shared functions
  /** Creates a short-lived light at world coordinates. */
  export import createLightAtWorld = sharedEffects.createLightAtWorld
  /** Spawns particles at world coordinates. */
  export import createParticlesAtWorld = sharedEffects.createParticlesAtWorld
  /** Creates a named screen effect at world coordinates. */
  export import createEffectAtWorld = sharedEffects.createEffectAtWorld
  // Shared types
  /** Options for generic screen effects. */
  export import EffectOptions = sharedEffects.EffectOptions
  /** Options for temporary lights. */
  export import TemporaryLightOptions = sharedEffects.TemporaryLightOptions
  /** Options for particle effects. */
  export import ParticleEffectOptions = sharedEffects.ParticleEffectOptions


  /** Creates a distortion wave effect at world coordinates. */
  export function createDistortionWaveAtWorld(worldX: number, worldY: number, options?: DistortionEffectOptions): void;
  /** Creates a laser beam between two world points. Returns a handle to destroy it. */
  export function createLaserAtWorld(startWorldX: number, startWorldY: number, endWorldX: number, endWorldY: number, options?: LaserEffectOptions): LaserEffectHandle;
  /** Removes a temporary light by its id. */
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
