import type { DataBag } from "../../common";

export interface InputBindingHandlers {
  down?: () => void;
  pressed?: () => void;
  released?: () => void;
}

export interface InputBindingOptions extends DataBag {
  displayNameKey?: string;
  displayNameParams?: Record<string, unknown>;
  category?: string;
  handlers: InputBindingHandlers;
}

export interface InputApi {
  registerBinding(id: string, keys: string | string[], options: InputBindingOptions): void;
  getBoundKeys(bindingId: string): string[];
  getDisplayKey(bindingId: string, fallback?: string): string;
  getMouseCellPosition(): { x: number; y: number } | null;
  isAltHeld(): boolean;
  isCtrlHeld(): boolean;
  pressBinding(bindingId: string): void;
  releaseBinding(bindingId: string): void;
  triggerBinding(bindingId: string): void;
  resetMouseState(): void;
}
