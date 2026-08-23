/**
 * `sandkit.api.camera` — camera focus and follow control.
 * Main thread only.
 */
export namespace camera {
  /** Snaps the camera to the player position. */
  export function snapToPlayer(): void;
  /** Moves camera focus to world coordinates. Returns true on success. */
  export function setFocusAtWorld(worldX: number, worldY: number): boolean;
  /** Releases scripted focus and returns control to the player. */
  export function releaseFocus(options?: { durationMs?: number; }): boolean;
}
