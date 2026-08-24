/**
 * `sandkit.api.cooldown` — reusable cooldown timers for abilities and items.
 * Main thread only.
 */
export namespace cooldown {
  /**
   * Starts the cooldown when ready and returns true; otherwise returns false.
   * @param cooldown - Cooldown state object to check and update.
   * @param overrideTime - Optional timestamp (ms) instead of current game time.
   */
  export function check(cooldown: Cooldown, overrideTime?: number): boolean;
  /**
   * Returns true when the cooldown has elapsed.
   * @param cooldown - Cooldown state object to check.
   * @param overrideTime - Optional timestamp (ms) instead of current game time.
   */
  export function isReady(cooldown: Cooldown, overrideTime?: number): boolean;

  /** Cooldown state object passed to {@link check} and {@link isReady}. */
  export interface Cooldown {
    /** Timestamp when the cooldown was last triggered (game time). */
    last: number;
    /** Cooldown duration in milliseconds. */
    time: number;
  }
}
