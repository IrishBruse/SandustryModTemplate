/**
 * Deferred callback scheduling on the next tick.
 *
 * Available as `sandkit.api.schedule`.
 *
 * @module
 */
export namespace schedule {
  /** Run a callback on the next game tick. */
  export function nextTick(callback: () => void): void;
}
