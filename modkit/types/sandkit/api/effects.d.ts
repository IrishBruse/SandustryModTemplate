import { effects as sharedEffects } from "../../shared/api/effects";

declare namespace effects {
  // Shared functions
  export import createLightAtWorld = sharedEffects.createLightAtWorld
  export import createParticlesAtWorld = sharedEffects.createParticlesAtWorld
  export import createEffectAtWorld = sharedEffects.createEffectAtWorld
  // Shared types
  export import EffectOptions = sharedEffects.EffectOptions
  export import TemporaryLightOptions = sharedEffects.TemporaryLightOptions
  export import ParticleEffectOptions = sharedEffects.ParticleEffectOptions


  export function createDistortionWaveAtWorld(worldX: number, worldY: number, options?: DistortionEffectOptions): void;
  export function createLaserAtWorld(startWorldX: number, startWorldY: number, endWorldX: number, endWorldY: number, options?: LaserEffectOptions): LaserEffectHandle;
  export function removeLightById(lightId: number): void;

  export interface LaserEffectOptions {
    width?: number;
    brightness?: number;
    color?: number;
    glow?: boolean;
  }

  export interface LaserEffectHandle {
    destroy(): void;
  }

  export interface DistortionEffectOptions {
    style?: 'implode' | 'explode';
    duration?: number;
    maxRadius?: number;
    intensity?: number;
    color?: [number, number, number, number];
  }
}
