/**
 * `sandkit.api.items` — register custom inventory items and query active items.
 * Main thread only.
 */
export namespace items {
  /** Definition for a mod-registered inventory item. */
  export interface ItemDefinition<State = unknown, Action = unknown> {
    /** Handles item use actions. */
    handleAction?: (state: State, action: Action) => unknown;
    /** Called after the item is rendered each frame. */
    afterRender?: (state: State) => void;
    [key: string]: unknown;
  }

  /** Registers a new item definition. */
  export function register(definition: ItemDefinition): void;
  /** Updates fields on an existing item definition. */
  export function updateDefinition(itemId: string, partial: Partial<ItemDefinition>): void;
  /** Returns the item definition for an id, or undefined. */
  export function getDefinitionById(itemId: string): ItemDefinition | undefined;
  /** Creates a runtime item instance from an id. */
  export function createFromId(itemId: string): ModItem;
  /** Returns the item definition for the active hotbar slot. */
  export function getActive(): ItemDefinition | undefined;
  /** Returns true when the given item is the active hotbar item. */
  export function isActiveById(itemId: string | number, itemType?: ItemType): boolean;

  /** Runtime item instance (not yet typed in declarations). */
  export type ModItem = unknown
  /** Item type id (not yet typed in declarations). */
  export type ItemType = unknown
}
