/**
 * `sandkit.api.cooldown` — reusable cooldown timers for abilities and items.
 * Main thread only.
 */
export namespace cooldown {
  /** Starts the cooldown when ready and returns true; otherwise returns false. */
  export function check(cooldown: Cooldown, overrideTime?: number): boolean;
  /** Returns true when the cooldown has elapsed. */
  export function isReady(cooldown: Cooldown, overrideTime?: number): boolean;

  // TODO
  /** Cooldown state object (shape not yet typed in declarations). */
  export type Cooldown = unknown
}
