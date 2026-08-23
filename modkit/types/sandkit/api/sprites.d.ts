/**
 * Sprite load, lookup, and player mod sprite transforms.
 *
 * Available as `sandkit.api.sprites`.
 *
 * @module
 */
export namespace sprites {
  /** Load a sprite from a URL path. */
  export function load(spriteId: string, path: string, options?: { tint?: number; }): Promise<void>;
  /** Load a sprite from the calling mod folder. */
  export function loadFromMod(spriteId: string, relativePath: string, options?: { tint?: number; }): Promise<void>;
  /** Return a loaded sprite by id. */
  export function getById(spriteId: string): any;
  /** Hide all player mod-attached sprites. */
  export function hideAllPlayerModSprites(): void;
  /** Rotate all player mod-attached sprites by angle. */
  export function rotatePlayerModSprites(angle: number): void;
}
