/**
 * `sandkit.api.input` — key bindings, mouse position, and modifier keys.
 * Main thread only.
 */
export namespace input {
  /**
   * Register a key binding and return its binding id.
   * @param bindingId - Unique id for the binding (also used in settings).
   * @param defaultKeys - Default key codes (for example `"Control+KeyC"`).
   * @param definition - Display metadata and press/release handlers.
   * @returns The registered binding id.
   */
  export function registerBinding(bindingId: string, defaultKeys: string[], definition: InputBindingDefinition): string;

  /**
   * Return the mouse position in cell coordinates.
   * @returns Cell `{ x, y }` under the cursor.
   */
  export function getMouseCellPosition(): { x: number; y: number; };

  /**
   * Return the keys currently bound to a binding id.
   * @param bindingId - Registered binding id.
   * @returns Key code strings for the active binding.
   */
  export function getBoundKeys(bindingId: string): string[];

  /**
   * Return a display label for the bound key.
   * @param bindingId - Registered binding id.
   * @param defaultLabel - Fallback label when no key is bound.
   * @returns Human-readable key label for UI.
   */
  export function getDisplayKey(bindingId: string, defaultLabel?: string): string;

  /**
   * Fire the binding down handler as if the key was pressed.
   * @param bindingId - Registered binding id.
   */
  export function triggerBinding(bindingId: string): void;

  /**
   * Fire the binding down handler without a matching release.
   * @param bindingId - Registered binding id.
   */
  export function pressBinding(bindingId: string): void;

  /**
   * Fire the binding up handler.
   * @param bindingId - Registered binding id.
   */
  export function releaseBinding(bindingId: string): void;

  /** Clear internal mouse button state. */
  export function resetMouseState(): void;

  /**
   * Return true when Ctrl is held.
   * @returns True when the Ctrl modifier is down.
   */
  export function isCtrlHeld(): boolean;

  /**
   * Return true when Alt is held.
   * @returns True when the Alt modifier is down.
   */
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
    /** i18n key for the display name (overrides displayName when set). */
    displayNameKey?: string;
    /** Settings category for grouping. */
    category: string;
    /** Press and release handlers. */
    handlers: InputBindingHandlers;

    // Temporary until we're sure we have the full definition.
    [key: string]: unknown;
  }
}
