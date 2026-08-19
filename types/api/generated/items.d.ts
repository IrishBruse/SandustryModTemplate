/**
 * Auto-generated from sandkit-api/runtime-dump.json
 * Run: npm run generate-types
 * Item registration
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiItems {
  /**
   * Create from id.
   * @param itemId item id.
   */
  createFromId: (itemId: string) => void;
  /** Return active. */
  getActive: () => string | null;
  /**
   * Return definition by id.
   * @param itemId item id.
   */
  getDefinitionById: (itemId: string) => Record<string, unknown> | undefined;
  /**
   * Return whether active by id.
   * @param itemId item id.
   */
  isActiveById: (itemId: string, itemType: string) => boolean;
  /**
   * Register a definition.
   * @param definition Registration definition object.
   */
  register: (definition: Record<string, unknown>) => void;
  /**
   * Update definition.
   * @param itemId item id.
   * @param partial Optional settings object.
   */
  updateDefinition: (itemId: string, partial: Record<string, unknown>) => void;
}
export type ApiItemsNamespace = ApiItems;
