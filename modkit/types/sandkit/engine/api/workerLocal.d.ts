/**
 * `sandkit.engine.api.workerLocal` — per-worker ephemeral key-value storage.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Available on worker threads only. Values do not persist across workers.
 *
 * @internal
 */
export namespace workerLocal {
  /** Remove all keys from worker-local storage. */
  export function clear(...args: unknown[]): unknown;
  /** Return a value by key, or undefined when missing. */
  export function get(...args: unknown[]): unknown;
  /** Return a value by key, initializing it when missing. */
  export function getOrInit(...args: unknown[]): unknown;
  /** Store a value by key. */
  export function set(...args: unknown[]): unknown;
}
