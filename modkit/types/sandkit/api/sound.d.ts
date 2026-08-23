export namespace sound {
  export function play(soundId: string, options?: any): SoundHandle;
  export function playActive(soundId: string, options?: any): SoundHandle;
  export function playLayers(layers: SoundLayer[], options?: { position?: { x: number; y: number; }; volume?: number; rateLimitKey?: string; rateLimitMs?: number; }): SoundHandle[];
  export function calculateDistanceOptionsAtWorld(worldX: number, worldY: number, baseVolume?: number): SoundOptions;
  export function stopById(soundId: string): void;
  export function stopActive(): void;
  export function stopAll(): void;

  export type SoundHandle = unknown
  export type SoundLayer = unknown
  export type SoundOptions = unknown
}