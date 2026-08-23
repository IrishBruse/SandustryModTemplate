/**
 * `sandkit.engine.api.entities` — entity type registration, spawn, and queries.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 * Engine methods pass game state as the first argument (args[0]); remaining entries are method-specific.
 *
 * @internal
 */
export namespace entities {
  /**
   * Create a light entity attached to a parent.
   * @param args - Game state first, then method-specific arguments.
   */
  export function createLight(...args: unknown[]): unknown;
  /**
   * Return all live entities.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getAll(...args: unknown[]): unknown;
  /**
   * Return all entities of one type.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getAllByType(...args: unknown[]): unknown;
  /**
   * Return all registered entity type definitions.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getAllTypeDefs(...args: unknown[]): unknown;
  /**
   * Return the sprite for an entity.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getSprite(...args: unknown[]): unknown;
  /**
   * Return one entity type definition by id.
   * @param args - Game state first, then method-specific arguments.
   */
  export function getTypeDef(...args: unknown[]): unknown;
  /**
   * Launch an entity with velocity or trajectory.
   * @param args - Game state first, then method-specific arguments.
   */
  export function launch(...args: unknown[]): unknown;
  /**
   * Register an entity spawner behavior.
   * @param args - Game state first, then method-specific arguments.
   */
  export function registerSpawner(...args: unknown[]): unknown;
  /**
   * Register a custom entity type.
   * @param args - Game state first, then method-specific arguments.
   */
  export function registerType(...args: unknown[]): unknown;
  /**
   * Spawn an entity instance.
   * @param args - Game state first, then method-specific arguments.
   */
  export function spawn(...args: unknown[]): unknown;
  /**
   * Start capturing entities for a tool or effect.
   * @param args - Game state first, then method-specific arguments.
   */
  export function startCapture(...args: unknown[]): unknown;
}
