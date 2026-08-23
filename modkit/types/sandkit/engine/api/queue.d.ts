/**
 * `sandkit.engine.api.queue` — deferred tick queue with handlers.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 * Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.
 *
 * @internal
 */
export namespace queue {
  /**
   * Enqueue work to run on a future tick.
   * @param args - Game state first, then method-specific arguments.
   */
  export function enqueue(...args: unknown[]): unknown;
  /**
   * Enqueue work to run after a tick delay.
   * @param args - Game state first, then method-specific arguments.
   */
  export function enqueueInTicks(...args: unknown[]): unknown;
  /**
   * Enqueue work that skips the current tick.
   * @param args - Game state first, then method-specific arguments.
   */
  export function enqueueSkipTick(...args: unknown[]): unknown;
  /**
   * Process pending queue items for the current tick.
   * @param args - Game state first, then method-specific arguments.
   */
  export function process(...args: unknown[]): unknown;
  /**
   * Register a handler for a queue item type.
   * @param args - Game state first, then method-specific arguments.
   */
  export function registerHandler(...args: unknown[]): unknown;
  /**
   * Remove queued items by key.
   * @param args - Game state first, then method-specific arguments.
   */
  export function removeByKey(...args: unknown[]): unknown;
}
