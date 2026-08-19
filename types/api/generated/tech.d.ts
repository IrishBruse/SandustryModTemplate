/**
 * Auto-generated from sandkit-api/runtime-dump.json
 * Run: npm run generate-types
 * Tech tree
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiTech {
  /**
   * Add definition.
   * @param techId tech id.
   * @param definition Registration definition object.
   */
  addDefinition: (techId: string, definition: Record<string, unknown>) => void;
  /**
   * Return definition by id.
   * @param techId tech id.
   */
  getDefinitionById: (techId: string) => Record<string, unknown> | undefined;
  /**
   * Return whether locked by id.
   * @param techId tech id.
   */
  isLockedById: (techId: string) => boolean;
  /**
   * Register node.
   * @param techId tech id.
   * @param definition Registration definition object.
   * @param options Optional settings object.
   */
  registerNode: (techId: string, definition: Record<string, unknown>, options: Record<string, unknown>) => void;
  /**
   * Set locked by id.
   * @param techId tech id.
   * @param locked locked flag.
   */
  setLockedById: (techId: string, locked: boolean) => void;
  /**
   * Update definition.
   * @param techId tech id.
   */
  updateDefinition: (techId: string, updates: Record<string, unknown>) => void;
}
export type ApiTechNamespace = ApiTech;
