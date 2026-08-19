/**
 * Auto-generated from types/api/runtime-dump.json
 * Run: npm run generate-types
 * Placement helpers
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ApiHandler, Method0, Method1, Method2, Method3, Method4, Method5, Method6 } from "../common";
export interface ApiBuilding {
  cancelPlacement: Method0;
  getSnappedPositionAtCell: Method2;
  isBlockedAtCell: Method2;
  selectStructure: Method1;
}
export type ApiBuildingNamespace = ApiBuilding;
