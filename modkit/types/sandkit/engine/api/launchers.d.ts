/**
 * `sandkit.engine.api.launchers` — launcher type registration.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 *
 * @internal
 */
export namespace launchers {
  /** Register a custom launcher type. */
  export function registerType(...args: unknown[]): unknown;
}
