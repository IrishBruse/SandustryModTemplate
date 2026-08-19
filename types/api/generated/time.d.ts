/**
 * Auto-generated from types/api/runtime-dump.json
 * Run: npm run generate-types
 * Simulation tick and time
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ApiHandler, Method0, Method1, Method2, Method3, Method4, Method5, Method6 } from "../common";
export interface ApiTime {
  getTick: Method0;
  getTimeMs: Method0;
}
export type ApiTimeNamespace = ApiTime;
