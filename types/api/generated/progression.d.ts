/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Story progression
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiProgression {
  /** Mark progression step complete. */
  complete: (request: Record<string, unknown>) => void;
}
export type ApiProgressionNamespace = ApiProgression;
