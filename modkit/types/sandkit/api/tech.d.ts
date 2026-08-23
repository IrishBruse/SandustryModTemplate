export namespace tech {
  export function getDefinitionById(techId: string): any;
  export function updateDefinition(techId: string, updates: any): void;
  export function addDefinition(techId: string, definition: any): void;
  export function registerNode(techId: TechGridId, definition: TechDefinition, options: { parentId: TechGridId; preferredPosition?: TechGridPosition; }): TechGridPosition;
  export function isLockedById(techId: string | number): boolean;
  export function setLockedById(techId: string | number, locked: boolean): void;

  export type TechGridId = unknown
  export type TechDefinition = unknown
  export type TechGridPosition = unknown
}