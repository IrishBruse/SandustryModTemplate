/**
 * `sandkit.engine.api.teleportZones` — player teleport zone management.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 *
 * @internal
 */
export namespace teleportZones {
  /** Add a teleport zone to the world. */
  export function add(...args: unknown[]): unknown;
  /** Return all teleport zones. */
  export function getAll(...args: unknown[]): unknown;
  /** Return the teleport zone at one grid cell. */
  export function getAtCell(...args: unknown[]): unknown;
  /** Return one teleport zone by id. */
  export function getById(...args: unknown[]): unknown;
  /** Remove a teleport zone. */
  export function remove(...args: unknown[]): unknown;
  /** Spawn default particles at a teleport zone. */
  export function spawnDefaultParticles(...args: unknown[]): unknown;
  /** Teleport the player to a zone or position. */
  export function teleportPlayerTo(...args: unknown[]): unknown;
}
