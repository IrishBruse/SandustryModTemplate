/**
 * Auto-generated from types/api/runtime-dump.json
 * Run: npm run generate-types
 * Energy network
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ApiHandler, Method0, Method1, Method2, Method3, Method4, Method5, Method6 } from "../common";
export interface ApiEnergy {
  addAtCell: Method4;
  consume: Method2;
  consumeExcludingNetworkAtCell: Method3;
  getNetworkAtCell: Method2;
  getNetworkFreeCapacityAtCell: Method2;
  registerType: Method3;
}
export type ApiEnergyNamespace = ApiEnergy;
