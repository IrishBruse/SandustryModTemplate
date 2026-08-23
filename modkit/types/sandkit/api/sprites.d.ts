export namespace sprites {
  export function load(spriteId: string, path: string, options?: { tint?: number; }): Promise<void>;
  export function loadFromMod(spriteId: string, relativePath: string, options?: { tint?: number; }): Promise<void>;
  export function getById(spriteId: string): any;
  export function hideAllPlayerModSprites(): void;
  export function rotatePlayerModSprites(angle: number): void;
}