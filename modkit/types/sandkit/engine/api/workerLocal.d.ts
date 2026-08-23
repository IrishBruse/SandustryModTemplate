/**
 * `sandkit.engine.api.workerLocal` — per-worker ephemeral key-value storage.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Available on worker threads only. Values do not persist across workers.
 *
 * @internal
 */
export namespace workerLocal {
  /**
   * Remove all keys from worker-local storage.
   * @param args - Worker-local context first on workers; otherwise game state first, then method-specific arguments.
   */
  export function clear(...args: unknown[]): unknown;
  /**
   * Return a value by key, or undefined when missing.
   * @param args - Worker-local context first on workers; otherwise game state first, then method-specific arguments.
   */
  export function get(...args: unknown[]): unknown;
  /**
   * Return a value by key, initializing it when missing.
   * @param args - Worker-local context first on workers; otherwise game state first, then method-specific arguments.
   */
  export function getOrInit(...args: unknown[]): unknown;
  /**
   * Store a value by key.
   * @param args - Worker-local context first on workers; otherwise game state first, then method-specific arguments.
   */
  export function set(...args: unknown[]): unknown;
}
