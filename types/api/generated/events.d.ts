/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Event bus
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiEvents {
  emit: (eventName: string, payload: unknown) => void;
  on: (eventName: string, handler: (...args: unknown[]) => unknown) => () => void;
}
export type ApiEventsNamespace = ApiEvents;
