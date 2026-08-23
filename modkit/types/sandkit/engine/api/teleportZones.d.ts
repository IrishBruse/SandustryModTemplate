/**
 * `sandkit.engine.api.teleportZones` — player teleport zone management.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 * Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.
 *
 * @internal
 */
export namespace teleportZones {
  /**
   * Add a teleport zone to the world.
   * @param args - Game state first, then method-specific arguments.
   */
  export function add(...args: unknown[]): unknown;
  /**
   * Return all teleport zones.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getAll(...args: unknown[]): unknown;
  /**
   * Return the teleport zone at one grid cell.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getAtCell(...args: unknown[]): unknown;
  /**
   * Return one teleport zone by id.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getById(...args: unknown[]): unknown;
  /**
   * Remove a teleport zone.
   * @param args - Game state first, then method-specific arguments.
   */
  export function remove(...args: unknown[]): unknown;
  /**
   * Spawn default particles at a teleport zone.
   * @param args - Game state first, then method-specific arguments.
   */
  export function spawnDefaultParticles(...args: unknown[]): unknown;
  /**
   * Teleport the player to a zone or position.
   * @param args - Game state first, then method-specific arguments.
   */
  export function teleportPlayerTo(...args: unknown[]): unknown;
}
