/**
 * `sandkit.engine.api.entities` — entity type registration, spawn, and queries.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 *
 * @internal
 */
export namespace entities {
  /** Create a light entity attached to a parent. */
  export function createLight(...args: unknown[]): unknown;
  /** Return all live entities. */
  export function getAll(...args: unknown[]): unknown;
  /** Return all entities of one type. */
  export function getAllByType(...args: unknown[]): unknown;
  /** Return all registered entity type definitions. */
  export function getAllTypeDefs(...args: unknown[]): unknown;
  /** Return the sprite for an entity. */
  export function getSprite(...args: unknown[]): unknown;
  /** Return one entity type definition by id. */
  export function getTypeDef(...args: unknown[]): unknown;
  /** Launch an entity with velocity or trajectory. */
  export function launch(...args: unknown[]): unknown;
  /** Register an entity spawner behavior. */
  export function registerSpawner(...args: unknown[]): unknown;
  /** Register a custom entity type. */
  export function registerType(...args: unknown[]): unknown;
  /** Spawn an entity instance. */
  export function spawn(...args: unknown[]): unknown;
  /** Start capturing entities for a tool or effect. */
  export function startCapture(...args: unknown[]): unknown;
}
