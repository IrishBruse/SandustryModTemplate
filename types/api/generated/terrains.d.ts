/**
 * Auto-generated from types/api/runtime-dump.json
 * Run: npm run generate-types
 * Terrain registration and mutation
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ApiHandler, Method0, Method1, Method2, Method3, Method4, Method5, Method6 } from "../common";
export interface ApiTerrains {
  createAtCellWhenIdle: Method4;
  damageAtCell: Method3;
  getDataAtCell: Method2;
  getTypeAtCell: Method2;
  getTypeFromId: Method1;
  isAtCell: Method2;
  isCellIdTerrain: Method1;
  isTypeAtCell: Method3;
  register: Method1;
  removeAtCellWhenIdle: Method3;
  replaceAtCellWhenIdle: Method4;
  setHpAtCellWhenIdle: Method3;
  updateDefinition: Method2;
}
export type ApiTerrainsNamespace = ApiTerrains;
