import type { DataBag } from "../../common";

/** React panel mount used by Power Monitor and Mod Inspector. */
export type UiInjectComponent = import("react").ComponentType | (() => import("react").ReactElement | null);

export interface UiOverlaysApi {
  register(layer: string, id: string, render: () => import("react").ReactElement | null): void;
  unregister(layer: string, id: string): void;
  update(layer: string): void;
}

export interface UiNavigationFocusableOptions {
  id: string;
  scope: string;
  disabled?: boolean;
  x?: number;
  y?: number;
}

export interface UiNavigationScopeOptions {
  id: string;
  active?: boolean;
  defaultId?: string;
  priority?: number;
}

export interface UiNavigationApi {
  controllerFocusClass(focused: boolean): string;
  useFocusScope(options: UiNavigationScopeOptions): void;
  useFocusable(options: UiNavigationFocusableOptions): {
    ref: import("react").RefObject<HTMLElement | null>;
    focused: boolean;
    focus: () => void;
  };
}

export interface UiApi {
  toast(message: string, durationMs?: number): void;
  update(root: string, payload?: unknown): void;
  alert(title: string, message: string): void;
  confirm(title: string, message: string): Promise<boolean>;
  prompt(
    title: string,
    message: string,
    defaultValue: string,
    options?: DataBag,
    placeholder?: string,
  ): Promise<string | null>;
  openPauseMenu(): void;
  showTooltip(options: DataBag): void;
  inject(componentId: string, component: UiInjectComponent): () => void;
  overlays: UiOverlaysApi;
  navigation: UiNavigationApi;
}
