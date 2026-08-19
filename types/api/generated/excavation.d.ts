/**
 * Auto-generated from sandkit-api/runtime-dump.json
 * Run: npm run generate-types
 * Excavation profiles
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiExcavation {
  /**
   * Register profile.
   * @param id id id.
   * @param definition Registration definition object.
   */
  registerProfile: (id: string, definition: Record<string, unknown>) => void;
}
export type ApiExcavationNamespace = ApiExcavation;
