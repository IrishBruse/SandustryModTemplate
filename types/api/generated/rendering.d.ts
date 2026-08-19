/**
 * Auto-generated from types/api/runtime-dump.json
 * Run: npm run generate-types
 * Draw positions, overlay canvas
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ApiHandler, Method0, Method1, Method2, Method3, Method4, Method5, Method6 } from "../common";
export interface ApiRendering {
  getDrawPositionAtCell: Method2;
  getGridMetrics: Method0;
  getOverlayViewportSize: Method0;
  withOverlayContext: Method1;
}
export type ApiRenderingNamespace = ApiRendering;
