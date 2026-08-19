/**
 * Auto-generated from sandkit-api/runtime-dump.json
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
  calculateDistanceOptionsAtWorld: (worldX: number, worldY: number, baseVolume: number) => Record<string, unknown>;
  /**
   * Play .
   * @param soundId sound id.
   * @param options Optional settings object.
   */
  play: (soundId: string, options: Record<string, unknown>) => void;
  /**
   * Play active.
   * @param soundId sound id.
   * @param options Optional settings object.
   */
  playActive: (soundId: string, options: Record<string, unknown>) => void;
  /**
   * Play layers.
   * @param options Optional settings object.
   */
  playLayers: (layers: Record<string, unknown>[], options: Record<string, unknown>) => void;
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
