/**
 * Projectile definitions, spawning, and lifecycle.
 *
 * Available as `sandkit.api.projectiles`.
 *
 * @module
 */
export namespace projectiles {
  /**
   * Register a projectile definition.
   * @param definition - Projectile id, sprite, and runtime options factory.
   */
  export function register(definition: ProjectileDefinition): void;

  /**
   * Return a projectile definition by string id.
   * @param projectileId - Registered projectile id.
   */
  export function getDefinitionById(projectileId: string): ProjectileDefinition | undefined;

  /**
   * Build a spawn blueprint from a projectile string id.
   * @param projectileId - Registered projectile id.
   * @returns Blueprint passed to {@link spawnAtWorld}.
   */
  export function createBlueprintFromId(projectileId: string): ProjectileBlueprint;

  /** Return all active projectiles. */
  export function getAll(): Projectile[];

  /**
   * Return a projectile by numeric id.
   * @param projectileId - Runtime projectile id.
   */
  export function getById(projectileId: number): Projectile | undefined;

  /**
   * Remove a projectile from the world.
   * @param projectile - Projectile instance to remove.
   */
  export function remove(projectile: Projectile): void;

  /**
   * Spawn a projectile at world position with angle and blueprint.
   * @param worldX - Spawn x position in world pixels.
   * @param worldY - Spawn y position in world pixels.
   * @param angle - Launch angle in radians.
   * @param blueprint - Blueprint from {@link createBlueprintFromId}.
   * @returns The spawned projectile instance.
   */
  export function spawnAtWorld(worldX: number, worldY: number, angle: number, blueprint: ProjectileBlueprint): Projectile;

  /** Mod-registered projectile definition. */
  export interface ProjectileDefinition {
    id: string;
    sprite: {
      id: string;
      tint?: number;
    };
    /** Returns spawn-time physics and visual options. */
    getOptions: () => Record<string, unknown>;
    /** Optional per-projectile mutable data factory. */
    getModData?: (state: unknown, projectile: Projectile) => Record<string, unknown>;
    [key: string]: unknown;
  }

  /** Blueprint used to spawn a projectile. */
  export interface ProjectileBlueprint {
    opts: Record<string, unknown>;
    type: unknown;
  }

  /** Active projectile instance. */
  export interface Projectile {
    id: number;
    x: number;
    y: number;
    [key: string]: unknown;
  }
}
