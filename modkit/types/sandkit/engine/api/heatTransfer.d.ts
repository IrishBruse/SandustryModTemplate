/**
 * `sandkit.engine.api.heatTransfer` — temperature diffusion and absorption.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 * Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.
 *
 * @internal
 */
export namespace heatTransfer {
  /**
   * Absorb heat from adjacent elements into a cell.
   * @param args - Game state first, then method-specific arguments.
   */
  export function absorbAdjacentElements(...args: unknown[]): unknown;
  /**
   * Add temperature to a cell or region.
   * @param args - Game state first, then method-specific arguments.
   */
  export function addTemperature(...args: unknown[]): unknown;
  /**
   * Compute diffused temperatures for connected cells.
   * @param args - Game state first, then method-specific arguments.
   */
  export function computeDiffusedTemperatures(...args: unknown[]): unknown;
  /**
   * Compute one equalized temperature across connected cells.
   * @param args - Game state first, then method-specific arguments.
   */
  export function computeEqualizedTemperature(...args: unknown[]): unknown;
  /**
   * Consume temperature near a point or cell.
   * @param args - Game state first, then method-specific arguments.
   */
  export function consumeTemperatureNear(...args: unknown[]): unknown;
  /**
   * Ensure a cell has at least the given temperature.
   * @param args - Game state first, then method-specific arguments.
   */
  export function ensureTemperature(...args: unknown[]): unknown;
  /**
   * Equalize temperature across a connected component.
   * @param args - Game state first, then method-specific arguments.
   */
  export function equalizeConnected(...args: unknown[]): unknown;
}
