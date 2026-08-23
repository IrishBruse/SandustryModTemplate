/**
 * `sandkit.engine.api.game` — game session start, save, and load.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 *
 * @internal
 */
export namespace game {
  /** Load a saved game into the session. */
  export function load(...args: unknown[]): unknown;
  /** Save the current session. */
  export function save(...args: unknown[]): unknown;
  /** Start a new game session. */
  export function start(...args: unknown[]): unknown;
}
