/**
 * `sandkit.engine.api.extensions` — structure extension definitions.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 *
 * @internal
 */
export namespace extensions {
  /** Define a structure extension type. */
  export function define(...args: unknown[]): unknown;
}
