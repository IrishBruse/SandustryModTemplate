/**
 * `sandkit.engine.api.swarmConsole` — swarm convergence console state.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 *
 * @internal
 */
export namespace swarmConsole {
  /** Decrease the convergence buffer by one step. */
  export function decrementConvergenceBuffer(...args: unknown[]): unknown;
  /** Return total crystal mined for swarm consoles. */
  export function getCrystalMined(...args: unknown[]): unknown;
  /** Return the disk radius in cells for a console. */
  export function getDiskRadiusCells(...args: unknown[]): unknown;
  /** Return the entity type used by swarm consoles. */
  export function getEntityType(...args: unknown[]): unknown;
  /** Return the nearest convergence point. */
  export function getNearestConvergence(...args: unknown[]): unknown;
  /** Return the pending convergence target. */
  export function getPendingConvergence(...args: unknown[]): unknown;
  /** Return all placed swarm console structures. */
  export function getPlacedConsoles(...args: unknown[]): unknown;
  /** Return the console effect radius in pixels. */
  export function getRadiusPx(...args: unknown[]): unknown;
  /** Return whether swarm spawn is currently jammed. */
  export function isSpawnJammed(...args: unknown[]): unknown;
  /** Register the entity type for swarm consoles. */
  export function registerEntityType(...args: unknown[]): unknown;
  /** Reset convergence buffers on all consoles. */
  export function resetAllConvergenceBuffers(...args: unknown[]): unknown;
  /** Set whether swarm spawn is jammed. */
  export function setSpawnJammed(...args: unknown[]): unknown;
}
