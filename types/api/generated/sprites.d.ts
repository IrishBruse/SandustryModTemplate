/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Sprite loading
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiSprites {
  /**
   * Return by id.
   * @param spriteId sprite id.
   */
  getById: (spriteId: string) => Record<string, unknown> | undefined;
  /** hide All Player Mod Sprites. */
  hideAllPlayerModSprites: () => void;
  /**
   * Load .
   * @param spriteId sprite id.
   * @param path path string.
   * @param options Optional settings object.
   */
  load: (spriteId: string, path: string, options: Record<string, unknown>) => void;
  /**
   * Load from mod.
   * @param spriteId sprite id.
   * @param relativePath relative Path string.
   * @param options Optional settings object.
   */
  loadFromMod: (spriteId: string, relativePath: string, options: Record<string, unknown>) => void;
  /**
   * rotate Player Mod Sprites.
   * @param angle angle.
   */
  rotatePlayerModSprites: (angle: number) => void;
}
export type ApiSpritesNamespace = ApiSprites;
