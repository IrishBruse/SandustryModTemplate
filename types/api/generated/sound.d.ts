/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Sound playback
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiSound {
  /**
   * Return SoundOptions.
   * @param worldX World X coordinate.
   * @param worldY World Y coordinate.
   * @param baseVolume base Volume.
   */
  calculateDistanceOptionsAtWorld: (worldX: number, worldY: number, baseVolume?: number) => SoundOptions;
  /**
   * Play .
   * @param soundId sound id.
   * @param options Optional settings object.
   */
  play: (soundId: string, options?: unknown) => SoundHandle;
  /**
   * Play active.
   * @param soundId sound id.
   * @param options Optional settings object.
   */
  playActive: (soundId: string, options?: unknown) => SoundHandle;
  /**
   * Play layers.
   * @param options Optional settings object.
   */
  playLayers: (layers: SoundLayer[], options?: { position?: { x: number; y: number; }; volume?: number; rateLimitKey?: string; rateLimitMs?: number; }) => SoundHandle[];
  /** Stop active. */
  stopActive: () => void;
  /** Stop all. */
  stopAll: () => void;
  /**
   * Stop by id.
   * @param soundId sound id.
   */
  stopById: (soundId: string) => void;
}
export type ApiSoundNamespace = ApiSound;
