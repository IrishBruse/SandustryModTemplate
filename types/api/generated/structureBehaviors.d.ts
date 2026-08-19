/**
 * Auto-generated from sandkit-api/runtime-dump.json
 * Run: npm run generate-types
 * Conveyor and launcher types
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiStructureBehaviors {
  /**
   * Register conveyor type.
   * @param structureId structure id.
   * @param options Optional settings object.
   */
  registerConveyorType: (structureId: string, options: Record<string, unknown>) => void;
  /**
   * Register launcher type.
   * @param definition Registration definition object.
   */
  registerLauncherType: (definition: Record<string, unknown>) => void;
}
export type ApiStructureBehaviorsNamespace = ApiStructureBehaviors;
