/**
 * Tech tree definitions, nodes, and lock state.
 *
 * Available as `sandkit.api.tech`.
 *
 * @module
 */
export namespace tech {
  /**
   * Return a tech definition by string id.
   * @param techId - Tech entry identifier.
   */
  export function getDefinitionById(techId: string): TechDefinition | undefined;
  /**
   * Patch fields on an existing tech definition.
   * @param techId - Tech entry identifier.
   * @param updates - Fields to merge into the definition.
   */
  export function updateDefinition(techId: string, updates: Partial<TechDefinition>): void;
  /**
   * Add a new tech definition by id.
   * @param techId - Tech entry identifier.
   * @param definition - Full tech definition to register.
   */
  export function addDefinition(techId: string, definition: TechDefinition): void;
  /**
   * Register a tech node on the grid with parent and position options.
   * @param techId - Tech grid node id.
   * @param definition - Tech definition for the node.
   * @param options - Parent node id and optional preferred grid position.
   */
  export function registerNode(techId: TechGridId, definition: TechDefinition, options: { parentId: TechGridId; preferredPosition?: TechGridPosition; }): TechGridPosition;
  /**
   * Return true when a tech entry is locked.
   * @param techId - Tech entry id (string or numeric enum).
   */
  export function isLockedById(techId: string | number): boolean;
  /**
   * Set locked state for a tech entry by id.
   * @param techId - Tech entry id (string or numeric enum).
   * @param locked - When true, the tech cannot be purchased.
   */
  export function setLockedById(techId: string | number, locked: boolean): void;

  /** Tech grid node id. */
  export type TechGridId = string | number
  /** Tech definition shape. */
  export interface TechDefinition {
    /** Display name translation key. */
    nameKey?: string;
    /** Description translation key. */
    descriptionKey?: string;
    [key: string]: unknown;
  }
  /** Position on the tech grid. */
  export interface TechGridPosition {
    x: number;
    y: number;
  }
}
