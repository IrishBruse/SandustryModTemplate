/**
 * Auto-generated from sandkit-api/runtime-dump.json
 * Run: npm run generate-types
 * Projectile spawn
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiProjectiles {
  /**
   * Create blueprint from id.
   * @param projectileId projectile id.
   */
  createBlueprintFromId: (projectileId: string) => void;
  /** Return all. */
  getAll: () => Record<string, unknown>[];
  /**
   * Return by id.
   * @param projectileId projectile id.
   */
  getById: (projectileId: string) => Record<string, unknown> | undefined;
  /**
   * Return definition by id.
   * @param projectileId projectile id.
   */
  getDefinitionById: (projectileId: string) => Record<string, unknown> | undefined;
  /**
   * Register a definition.
   * @param definition Registration definition object.
   */
  register: (definition: Record<string, unknown>) => void;
  /** Remove . */
  remove: (projectile: Record<string, unknown>) => void;
  /**
   * Spawn at world.
   * @param worldX World X coordinate.
   * @param worldY World Y coordinate.
   * @param angle angle.
   */
  spawnAtWorld: (worldX: number, worldY: number, angle: number, blueprint: Record<string, unknown>) => void;
}
export type ApiProjectilesNamespace = ApiProjectiles;
