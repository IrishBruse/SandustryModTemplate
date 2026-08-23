/**
 * `sandkit.engine.api.prismaline` — prismaline resource consume and availability.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 * Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.
 *
 * @internal
 */
export namespace prismaline {
  /**
   * Consume prismaline from the player or world.
   * @param args - Game state first, then method-specific arguments.
   */
  export function consume(...args: unknown[]): unknown;
  /**
   * Return available prismaline amount.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getAvailable(...args: unknown[]): unknown;
  /**
   * Return total prismaline consumed so far.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getConsumed(...args: unknown[]): unknown;
}
