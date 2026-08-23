/**
 * Engine-only: `sandkit.engine.api.queue`.
 * @internal
 */
export namespace queue {
  export function enqueue(...args: unknown[]): unknown;
  export function enqueueInTicks(...args: unknown[]): unknown;
  export function enqueueSkipTick(...args: unknown[]): unknown;
  export function process(...args: unknown[]): unknown;
  export function registerHandler(...args: unknown[]): unknown;
  export function removeByKey(...args: unknown[]): unknown;
}
