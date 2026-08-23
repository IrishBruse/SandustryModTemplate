/**
 * `sandkit.engine.api.queue` — deferred tick queue with handlers.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 *
 * @internal
 */
export namespace queue {
  /** Enqueue work to run on a future tick. */
  export function enqueue(...args: unknown[]): unknown;
  /** Enqueue work to run after a tick delay. */
  export function enqueueInTicks(...args: unknown[]): unknown;
  /** Enqueue work that skips the current tick. */
  export function enqueueSkipTick(...args: unknown[]): unknown;
  /** Process pending queue items for the current tick. */
  export function process(...args: unknown[]): unknown;
  /** Register a handler for a queue item type. */
  export function registerHandler(...args: unknown[]): unknown;
  /** Remove queued items by key. */
  export function removeByKey(...args: unknown[]): unknown;
}
