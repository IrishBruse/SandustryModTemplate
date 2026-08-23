/**
 * Projectile definitions, spawning, and lifecycle.
 *
 * Available as `sandkit.api.projectiles`.
 *
 * @module
 */
export namespace projectiles {
  /** Register a projectile definition. */
  export function register(definition: any): void;
  /** Return a projectile definition by string id. */
  export function getDefinitionById(projectileId: string): any;
  /** Build a spawn blueprint from a projectile string id. */
  export function createBlueprintFromId(projectileId: string): ProjectileBlueprint;
  /** Return all active projectiles. */
  export function getAll(): Projectile[];
  /** Return a projectile by numeric id. */
  export function getById(projectileId: number): Projectile | undefined;
  /** Remove a projectile from the world. */
  export function remove(projectile: Projectile): void;
  /** Spawn a projectile at world position with angle and blueprint. */
  export function spawnAtWorld(worldX: number, worldY: number, angle: number, blueprint: ProjectileBlueprint): Projectile;

  /** Blueprint used to spawn a projectile. */
  export type ProjectileBlueprint = unknown
  /** Active projectile instance. */
  export type Projectile = unknown
}
