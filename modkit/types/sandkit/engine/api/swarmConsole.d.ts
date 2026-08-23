/**
 * `sandkit.engine.api.swarmConsole` — swarm convergence console state.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 * Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.
 *
 * @internal
 */
export namespace swarmConsole {
  /**
   * Decrease the convergence buffer by one step.
   * @param args - Game state first, then method-specific arguments.
   */
  export function decrementConvergenceBuffer(...args: unknown[]): unknown;
  /**
   * Return total crystal mined for swarm consoles.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getCrystalMined(...args: unknown[]): unknown;
  /**
   * Return the disk radius in cells for a console.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getDiskRadiusCells(...args: unknown[]): unknown;
  /**
   * Return the entity type used by swarm consoles.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getEntityType(...args: unknown[]): unknown;
  /**
   * Return the nearest convergence point.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getNearestConvergence(...args: unknown[]): unknown;
  /**
   * Return the pending convergence target.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getPendingConvergence(...args: unknown[]): unknown;
  /**
   * Return all placed swarm console structures.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getPlacedConsoles(...args: unknown[]): unknown;
  /**
   * Return the console effect radius in pixels.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getRadiusPx(...args: unknown[]): unknown;
  /**
   * Return whether swarm spawn is currently jammed.
   * @param args - Game state first, then method-specific arguments.
   */
  export function isSpawnJammed(...args: unknown[]): unknown;
  /**
   * Register the entity type for swarm consoles.
   * @param args - Game state first, then method-specific arguments.
   */
  export function registerEntityType(...args: unknown[]): unknown;
  /**
   * Reset convergence buffers on all consoles.
   * @param args - Game state first, then method-specific arguments.
   */
  export function resetAllConvergenceBuffers(...args: unknown[]): unknown;
  /**
   * Set whether swarm spawn is jammed.
   * @param args - Game state first, then method-specific arguments.
   */
  export function setSpawnJammed(...args: unknown[]): unknown;
}
