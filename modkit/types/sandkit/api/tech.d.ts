/**
 * Tech tree definitions, nodes, and lock state.
 *
 * Available as `sandkit.api.tech`.
 *
 * @module
 */
export namespace tech {
  /** Return a tech definition by string id. */
  export function getDefinitionById(techId: string): any;
  /** Patch fields on an existing tech definition. */
  export function updateDefinition(techId: string, updates: any): void;
  /** Add a new tech definition by id. */
  export function addDefinition(techId: string, definition: any): void;
  /** Register a tech node on the grid with parent and position options. */
  export function registerNode(techId: TechGridId, definition: TechDefinition, options: { parentId: TechGridId; preferredPosition?: TechGridPosition; }): TechGridPosition;
  /** Return true when a tech entry is locked. */
  export function isLockedById(techId: string | number): boolean;
  /** Set locked state for a tech entry by id. */
  export function setLockedById(techId: string | number, locked: boolean): void;

  /** Tech grid node id. */
  export type TechGridId = unknown
  /** Tech definition shape. */
  export type TechDefinition = unknown
  /** Position on the tech grid. */
  export type TechGridPosition = unknown
}
