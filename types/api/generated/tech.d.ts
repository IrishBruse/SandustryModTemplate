/**
 * Auto-generated from types/api/source/runtime-dump.json
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
  addDefinition: (techId: string, definition: unknown) => void;
  /**
   * Return definition by id.
   * @param techId tech id.
   */
  getDefinitionById: (techId: string) => unknown;
  /**
   * Return whether locked by id.
   * @param techId tech id.
   */
  isLockedById: (techId: string | number) => boolean;
  /**
   * Register node.
   * @param techId tech id.
   * @param definition Registration definition object.
   * @param options Optional settings object.
   */
  registerNode: (techId: TechGridId, definition: TechDefinition, options?: { parentId: TechGridId; preferredPosition?: TechGridPosition; }) => TechGridPosition;
  /**
   * Set locked by id.
   * @param techId tech id.
   * @param locked locked flag.
   */
  setLockedById: (techId: string | number, locked: boolean) => void;
  /**
   * Update definition.
   * @param techId tech id.
   */
  updateDefinition: (techId: string, updates: unknown) => void;
}
export type ApiTechNamespace = ApiTech;
