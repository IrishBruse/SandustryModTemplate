/**
 * `sandkit.engine.api.wall` — wall tile palette and cell data.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 *
 * @internal
 */
export namespace wall {
  /** Return wall palette data for rendering. */
  export function getPaletteData(...args: unknown[]): unknown;
  /** Return wall tile data at one cell. */
  export function getWallDataAt(...args: unknown[]): unknown;
  /** Return the byte size of wall tile data. */
  export function getWallDataSize(...args: unknown[]): unknown;
  /** Set wall tile data at one cell. */
  export function setWallDataAt(...args: unknown[]): unknown;
}
