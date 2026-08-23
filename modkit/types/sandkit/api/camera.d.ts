/**
 * `sandkit.api.camera` — camera focus and follow control.
 * Main thread only.
 */
export namespace camera {
  /** Snap the camera to the player position. */
  export function snapToPlayer(): void;

  /**
   * Move camera focus to world coordinates.
   * @param worldX - World x position in pixels.
   * @param worldY - World y position in pixels.
   * @returns True when focus was applied.
   */
  export function setFocusAtWorld(worldX: number, worldY: number): boolean;

  /**
   * Release scripted focus and return control to the player.
   * @param options - Optional transition duration in milliseconds.
   * @returns True when focus was released.
   */
  export function releaseFocus(options?: { durationMs?: number; }): boolean;
}
