/**
 * `sandkit.engine.api.extensions` — structure extension definitions.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 * Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.
 *
 * @internal
 */
export namespace extensions {
  /**
   * Define a structure extension type.
   * @param args - Game state first, then method-specific arguments.
   */
  export function define(...args: unknown[]): unknown;
}
