/**
 * Game time in milliseconds and tick counter.
 *
 * Available as `sandkit.api.time`.
 *
 * @module
 */
export namespace time {
  /** Return elapsed game time in milliseconds. */
  export function getTimeMs(): number;
  /** Return the current simulation tick number. */
  export function getTick(): number;
}
