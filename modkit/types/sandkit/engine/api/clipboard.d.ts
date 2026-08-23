/**
 * `sandkit.engine.api.clipboard` — build clipboard copy, paste, and history.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 *
 * @internal
 */
export namespace clipboard {
  /** Activate the clipboard tool or mode. */
  export function activate(...args: unknown[]): unknown;
  /** Clear the current clipboard contents. */
  export function clear(...args: unknown[]): unknown;
  /** Return the current clipboard payload. */
  export function get(...args: unknown[]): unknown;
  /** Return clipboard history entries. */
  export function getHistory(...args: unknown[]): unknown;
  /** Return signal links stored on the clipboard. */
  export function getSignalLinks(...args: unknown[]): unknown;
  /** Restore a clipboard entry from history. */
  export function selectFromHistory(...args: unknown[]): unknown;
  /** Set the clipboard payload. */
  export function set(...args: unknown[]): unknown;
}
