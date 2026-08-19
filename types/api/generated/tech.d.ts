/**
 * Auto-generated from types/api/runtime-dump.json
 * Run: npm run generate-types
 * Tech tree
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ApiHandler, Method0, Method1, Method2, Method3, Method4, Method5, Method6 } from "../common";
export interface ApiTech {
  addDefinition: Method2;
  getDefinitionById: Method1;
  isLockedById: Method1;
  registerNode: Method3;
  setLockedById: Method2;
  updateDefinition: Method2;
}
export type ApiTechNamespace = ApiTech;
