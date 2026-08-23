/**
 * Sprite load, lookup, and player mod sprite transforms.
 *
 * Available as `sandkit.api.sprites`.
 *
 * @module
 */
export namespace sprites {
  /**
   * Load a sprite from a URL path.
   * @param spriteId - Id used with {@link getById}.
   * @param path - URL or asset path to load.
   * @param options - Optional tint and load options.
   */
  export function load(spriteId: string, path: string, options?: SpriteLoadOptions): Promise<void>;
  /**
   * Load a sprite from the calling mod folder.
   * @param spriteId - Id used with {@link getById}.
   * @param relativePath - Path relative to the mod folder.
   * @param options - Optional tint and load options.
   */
  export function loadFromMod(spriteId: string, relativePath: string, options?: SpriteLoadOptions): Promise<void>;
  /**
   * Return a loaded sprite by id.
   * @param spriteId - Sprite id from {@link load} or {@link loadFromMod}.
   */
  export function getById(spriteId: string): LoadedSprite | undefined;
  /** Hide all player mod-attached sprites. */
  export function hideAllPlayerModSprites(): void;
  /**
   * Rotate all player mod-attached sprites by angle.
   * @param angle - Rotation in radians.
   */
  export function rotatePlayerModSprites(angle: number): void;

  /** Loaded sprite handle (runtime texture or display object). */
  export type LoadedSprite = unknown

  /** Options for {@link load} and {@link loadFromMod}. */
  export interface SpriteLoadOptions {
    /** Packed RGB tint applied after load. */
    tint?: number;
    [key: string]: unknown;
  }
}
