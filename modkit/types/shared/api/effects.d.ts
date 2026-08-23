import type { Vector2 } from "../../shared/player";

export namespace effects {
  export function createLightAtWorld(worldX: number, worldY: number, options?: TemporaryLightOptions): { index: number | null; };
  export function createParticlesAtWorld(worldX: number, worldY: number, options?: ParticleEffectOptions): void;
  export function createEffectAtWorld(effectId: "heatWave", worldX: number, worldY: number, options?: EffectOptions): void;

  export interface EffectOptions {
    duration?: number,
    maxRadius?: number,
    intensity?: number,
  }
  export interface TemporaryLightOptions {
    brightness?: number,
    duration?: number,
    durationMs?: number,
    size?: number,
    color?: [number, number, number, number],
    decay: number,
    unclamped?: boolean,
    skipDedup?: boolean,
    useLightZones?: boolean,
    noopIfFull?: boolean,
    priority?: number,
    dedupKey: string,
  }
  export interface ParticleEffectOptions {
    count?: number,
    velocity?: Vector2,
    minSpeed?: number,
    maxSpeed?: number,
    /** @description Hex code. No alpha. */
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