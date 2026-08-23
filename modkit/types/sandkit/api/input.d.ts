export namespace input {
  export function registerBinding(bindingId: string, defaultKeys: string[], definition: InputBindingDefinition): string;
  export function getMouseCellPosition(): { x: number; y: number; };
  export function getBoundKeys(bindingId: string): string[];
  export function getDisplayKey(bindingId: string, defaultLabel?: string): string;
  export function triggerBinding(bindingId: string): void;
  export function pressBinding(bindingId: string): void;
  export function releaseBinding(bindingId: string): void;
  export function resetMouseState(): void;
  export function isCtrlHeld(): boolean;
  export function isAltHeld(): boolean;

  export interface InputBindingHandlers {
    down?: () => void;
    up?: () => void;
  }

  export interface InputBindingDefinition {
    displayName: string;
    category: string;
    handlers: InputBindingHandlers;

    // Temporary until we're sure we have the full definition.
    [key: string]: unknown;
  }
}
