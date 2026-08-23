/**
 * `sandkit.engine.api.heatTransfer` — temperature diffusion and absorption.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 *
 * @internal
 */
export namespace heatTransfer {
  /** Absorb heat from adjacent elements into a cell. */
  export function absorbAdjacentElements(...args: unknown[]): unknown;
  /** Add temperature to a cell or region. */
  export function addTemperature(...args: unknown[]): unknown;
  /** Compute diffused temperatures for connected cells. */
  export function computeDiffusedTemperatures(...args: unknown[]): unknown;
  /** Compute one equalized temperature across connected cells. */
  export function computeEqualizedTemperature(...args: unknown[]): unknown;
  /** Consume temperature near a point or cell. */
  export function consumeTemperatureNear(...args: unknown[]): unknown;
  /** Ensure a cell has at least the given temperature. */
  export function ensureTemperature(...args: unknown[]): unknown;
  /** Equalize temperature across a connected component. */
  export function equalizeConnected(...args: unknown[]): unknown;
}
