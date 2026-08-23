/**
 * Sound playback, layers, and stop controls.
 *
 * Available as `sandkit.api.sound`.
 *
 * @module
 */
export namespace sound {
  /** Play a sound by id with optional options. */
  export function play(soundId: string, options?: any): SoundHandle;
  /** Play a sound on the active sound channel. */
  export function playActive(soundId: string, options?: any): SoundHandle;
  /** Play multiple sound layers with shared options. */
  export function playLayers(layers: SoundLayer[], options?: { position?: { x: number; y: number; }; volume?: number; rateLimitKey?: string; rateLimitMs?: number; }): SoundHandle[];
  /** Build distance-based volume options for a world position. */
  export function calculateDistanceOptionsAtWorld(worldX: number, worldY: number, baseVolume?: number): SoundOptions;
  /** Stop a sound by id. */
  export function stopById(soundId: string): void;
  /** Stop the active sound channel. */
  export function stopActive(): void;
  /** Stop all playing sounds. */
  export function stopAll(): void;

  /** Handle returned from a play call. */
  export type SoundHandle = unknown
  /** One layer in a layered sound. */
  export type SoundLayer = unknown
  /** Options passed to sound play helpers. */
  export type SoundOptions = unknown
}
