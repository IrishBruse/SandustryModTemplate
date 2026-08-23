/**
 * Sound playback, layers, and stop controls.
 *
 * Available as `sandkit.api.sound`.
 *
 * @module
 */
export namespace sound {
  /**
   * Play a sound by id with optional options.
   * @param soundId - Registered sound identifier.
   * @param options - Volume, position, playback rate, and rate-limit options.
   */
  export function play(soundId: string, options?: SoundOptions): SoundHandle;
  /**
   * Play a sound on the active sound channel.
   * @param soundId - Registered sound identifier.
   * @param options - Volume, position, playback rate, and rate-limit options.
   */
  export function playActive(soundId: string, options?: SoundOptions): SoundHandle;
  /**
   * Play multiple sound layers with shared options.
   * @param layers - Layer definitions (sound id, volume, delay, and per-layer options).
   * @param options - Shared position, volume, and rate-limit options for all layers.
   */
  export function playLayers(layers: SoundLayer[], options?: SoundLayersOptions): SoundHandle[];
  /**
   * Build distance-based volume options for a world position.
   * @param worldX - World X coordinate in pixels.
   * @param worldY - World Y coordinate in pixels.
   * @param baseVolume - Base volume before distance attenuation.
   */
  export function calculateDistanceOptionsAtWorld(worldX: number, worldY: number, baseVolume?: number): SoundOptions;
  /**
   * Stop a sound by id.
   * @param soundId - Registered sound identifier to stop.
   */
  export function stopById(soundId: string): void;
  /** Stop the active sound channel. */
  export function stopActive(): void;
  /** Stop all playing sounds. */
  export function stopAll(): void;

  /** Handle returned from a play call. */
  export interface SoundHandle {
    /** Stop this sound instance. */
    stop(): void;
  }

  /** One layer in a layered sound. */
  export interface SoundLayer {
    /** Sound id for this layer. */
    soundId: string;
    /** Layer volume multiplier. */
    volume?: number;
    /** Delay in milliseconds before this layer plays. */
    delay?: number;
    /** Playback rate for this layer. */
    playbackRate?: number;
    [key: string]: unknown;
  }

  /** Options passed to sound play helpers. */
  export interface SoundOptions {
    /** Volume multiplier (0–1 typical). */
    volume?: number;
    /** Playback rate multiplier. */
    playbackRate?: number;
    /** World position for distance attenuation. */
    position?: { x: number; y: number };
    /** When true, loop until stopped. */
    loop?: boolean;
    /** Key used with rateLimitMs to dedupe rapid replays. */
    rateLimitKey?: string;
    /** Minimum ms between plays with the same rateLimitKey. */
    rateLimitMs?: number;
    [key: string]: unknown;
  }

  /** Shared options for {@link playLayers}. */
  export interface SoundLayersOptions {
    /** World position applied to all layers. */
    position?: { x: number; y: number };
    /** Volume multiplier applied to all layers. */
    volume?: number;
    /** Key used with rateLimitMs to dedupe rapid replays. */
    rateLimitKey?: string;
    /** Minimum ms between plays with the same rateLimitKey. */
    rateLimitMs?: number;
  }
}
