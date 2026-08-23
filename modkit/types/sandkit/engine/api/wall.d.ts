/**
 * `sandkit.engine.api.wall` — wall tile palette and cell data.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 * Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.
 *
 * @internal
 */
export namespace wall {
  /**
   * Return wall palette data for rendering.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getPaletteData(...args: unknown[]): unknown;
  /**
   * Return wall tile data at one cell.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getWallDataAt(...args: unknown[]): unknown;
  /**
   * Return the byte size of wall tile data.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getWallDataSize(...args: unknown[]): unknown;
  /**
   * Set wall tile data at one cell.
   * @param args - Game state first, then method-specific arguments.
   */
  export function setWallDataAt(...args: unknown[]): unknown;
}
