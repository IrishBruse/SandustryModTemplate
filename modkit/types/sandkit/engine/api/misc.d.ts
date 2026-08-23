/**
 * `sandkit.engine.api.misc` — miscellaneous structure behavior registration.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 *
 * @internal
 */
export namespace misc {
  /** Register a miscellaneous structure behavior. */
  export function register(...args: unknown[]): unknown;
}
