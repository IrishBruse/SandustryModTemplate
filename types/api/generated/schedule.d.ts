/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * nextTick scheduling
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiSchedule {
  /**
   * Schedule work on the next main-thread tick.
   * @param callback Callback function.
   */
  nextTick: (callback: (...args: unknown[]) => unknown) => void;
}
export type ApiScheduleNamespace = ApiSchedule;
