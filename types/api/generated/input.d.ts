/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Key bindings and mouse
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiInput {
  /**
   * Return bound keys.
   * @param bindingId binding id.
   */
  getBoundKeys: (bindingId: string) => string[];
  /**
   * Return display key.
   * @param bindingId binding id.
   * @param defaultLabel default Label string.
   */
  getDisplayKey: (bindingId: string, defaultLabel: string) => string;
  /** Return mouse cell position. */
  getMouseCellPosition: () => { x: number; y: number };
  /** Return whether alt held. */
  isAltHeld: () => boolean;
  /** Return whether ctrl held. */
  isCtrlHeld: () => boolean;
  /**
   * press Binding.
   * @param bindingId binding id.
   */
  pressBinding: (bindingId: string) => void;
  /**
   * Register binding.
   * @param bindingId binding id.
   * @param defaultKeys default Keys string.
   * @param definition Registration definition object.
   */
  registerBinding: (bindingId: string, defaultKeys: string, definition: Record<string, unknown>) => void;
  /**
   * release Binding.
   * @param bindingId binding id.
   */
  releaseBinding: (bindingId: string) => void;
  /** reset Mouse State. */
  resetMouseState: () => void;
  /**
   * trigger Binding.
   * @param bindingId binding id.
   */
  triggerBinding: (bindingId: string) => void;
}
export type ApiInputNamespace = ApiInput;
