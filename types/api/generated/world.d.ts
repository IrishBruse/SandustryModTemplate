/**
 * Auto-generated from types/api/runtime-dump.json
 * Run: npm run generate-types
 * Cell reads, excavation, idle mutation
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ApiHandler, Method0, Method1, Method2, Method3, Method4, Method5, Method6 } from "../common";
export interface ApiWorld {
  excavateAtCell: Method5;
  getCellIdAtCell: Method2;
  isCellEmptyAtCell: Method2;
  isTerrainAtCell: Method2;
  pickups: ApiWorldPickups;
  redrawAroundCellWhenIdle: Method3;
  reportActivityAtCell: Method2;
  revealFogAtCell: Method2;
  runWhenSimulationIdle: Method1;
}
export interface ApiWorldPickups {
  destroy: Method1;
  getAll: Method0;
  getById: Method1;
  pickUp: Method1;
  spawnAtWorld: Method5;
}
export type ApiWorldNamespace = ApiWorld;
