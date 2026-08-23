/**
 * `sandkit.engine.api.debug` — debug overlay registration.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 *
 * @internal
 */
export namespace debug {
  /** Register a debug overlay or helper. */
  export function register(...args: unknown[]): unknown;
}
