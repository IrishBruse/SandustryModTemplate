export namespace items {
  export interface ItemDefinition<State = unknown, Action = unknown> {
    handleAction?: (state: State, action: Action) => unknown;
    afterRender?: (state: State) => void;
    [key: string]: unknown;
  }

  export function register(definition: ItemDefinition): void;
  export function updateDefinition(itemId: string, partial: Partial<ItemDefinition>): void;
  export function getDefinitionById(itemId: string): ItemDefinition | undefined;
  export function createFromId(itemId: string): ModItem;
  export function getActive(): ItemDefinition | undefined;
  export function isActiveById(itemId: string | number, itemType?: ItemType): boolean;

  export type ModItem = unknown
  export type ItemType = unknown
}
