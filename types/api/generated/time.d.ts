/**
 * Auto-generated from sandkit-api/runtime-dump.json
 * Run: npm run generate-types
 * Simulation tick and time
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiTime {
  /** Return tick. */
  getTick: () => number;
  /** Return time ms. */
  getTimeMs: () => number;
}
export type ApiTimeNamespace = ApiTime;
