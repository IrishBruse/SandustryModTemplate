/**
 * Auto-generated from types/api/runtime-dump.json
 * Run: npm run generate-types
 * Collector value queries
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ApiHandler, Method0, Method1, Method2, Method3, Method4, Method5, Method6 } from "../common";
export interface ApiCollector {
  getValueByType: Method1;
  getValueFromCellId: Method1;
  isCellIdCollectable: Method1;
  isCellIdCollectableForSprite: Method1;
  notifyPickupAtCell: Method2;
}
export type ApiCollectorNamespace = ApiCollector;
