/**
 * `sandkit.api.input` — key bindings, mouse position, and modifier keys.
 * Main thread only.
 */
export namespace input {
  /** Registers a key binding and returns its binding id. */
  export function registerBinding(bindingId: string, defaultKeys: string[], definition: InputBindingDefinition): string;
  /** Returns the mouse position in cell coordinates. */
  export function getMouseCellPosition(): { x: number; y: number; };
  /** Returns the keys currently bound to a binding id. */
  export function getBoundKeys(bindingId: string): string[];
  /** Returns a display label for the bound key. */
  export function getDisplayKey(bindingId: string, defaultLabel?: string): string;
  /** Fires the binding down handler as if the key was pressed. */
  export function triggerBinding(bindingId: string): void;
  /** Fires the binding down handler without a matching release. */
  export function pressBinding(bindingId: string): void;
  /** Fires the binding up handler. */
  export function releaseBinding(bindingId: string): void;
  /** Clears internal mouse button state. */
  export function resetMouseState(): void;
  /** Returns true when Ctrl is held. */
  export function isCtrlHeld(): boolean;
  /** Returns true when Alt is held. */
  export function isAltHeld(): boolean;

  /** Handlers invoked when a binding is pressed or released. */
  export interface InputBindingHandlers {
    /** Called when the binding is pressed. */
    down?: () => void;
    /** Called when the binding is released. */
    up?: () => void;
  }

  /** Definition for a registered input binding. */
  export interface InputBindingDefinition {
    /** Display name shown in settings. */
    displayName: string;
    /** Settings category for grouping. */
    category: string;
    /** Press and release handlers. */
    handlers: InputBindingHandlers;

    // Temporary until we're sure we have the full definition.
    [key: string]: unknown;
  }
}
