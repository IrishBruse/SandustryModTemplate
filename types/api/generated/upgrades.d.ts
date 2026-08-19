/**
 * Auto-generated from types/api/runtime-dump.json
 * Run: npm run generate-types
 * Upgrade trees
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ApiHandler, Method0, Method1, Method2, Method3, Method4, Method5, Method6 } from "../common";
export interface ApiUpgrades {
  getAvailableLevelById: Method2;
  getLevelById: Method2;
  register: Method1;
  registerCategory: Method1;
  updateDefinition: Method3;
}
export type ApiUpgradesNamespace = ApiUpgrades;
