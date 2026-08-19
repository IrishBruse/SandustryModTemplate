/**
 * Auto-generated from types/api/runtime-dump.json
 * Run: npm run generate-types
 * Projectile spawn
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ApiHandler, Method0, Method1, Method2, Method3, Method4, Method5, Method6 } from "../common";
export interface ApiProjectiles {
  createBlueprintFromId: Method1;
  getAll: Method0;
  getById: Method1;
  getDefinitionById: Method1;
  register: Method1;
  remove: Method1;
  spawnAtWorld: Method4;
}
export type ApiProjectilesNamespace = ApiProjectiles;
