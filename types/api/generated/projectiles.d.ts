/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Projectile spawn
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiProjectiles {
  /**
   * Create blueprint from id.
   * @param projectileId projectile id.
   */
  createBlueprintFromId: (projectileId: string) => ProjectileBlueprint;
  /** Return all. */
  getAll: () => Projectile[];
  /**
   * Return by id.
   * @param projectileId projectile id.
   */
  getById: (projectileId: number) => Projectile | undefined;
  /**
   * Return definition by id.
   * @param projectileId projectile id.
   */
  getDefinitionById: (projectileId: string) => unknown;
  /**
   * Register a definition.
   * @param definition Registration definition object.
   */
  register: (definition: unknown) => void;
  /** Remove . */
  remove: (projectile: Projectile) => void;
  /**
   * Spawn at world.
   * @param worldX World X coordinate.
   * @param worldY World Y coordinate.
   * @param angle angle.
   */
  spawnAtWorld: (worldX: number, worldY: number, angle: number, blueprint: ProjectileBlueprint) => Projectile;
}
export type ApiProjectilesNamespace = ApiProjectiles;
