/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Interval triggers (main)
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiTriggers {
  /**
   * Register a definition.
   * @param triggerId trigger id.
   * @param definition Registration definition object.
   */
  register: (triggerId: string, definition: MainTriggerDefinition) => void;
}
export type ApiTriggersNamespace = ApiTriggers;
