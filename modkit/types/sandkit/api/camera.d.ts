export namespace camera {
  export function snapToPlayer(): void;
  export function setFocusAtWorld(worldX: number, worldY: number): boolean;
  export function releaseFocus(options?: { durationMs?: number; }): boolean;
}