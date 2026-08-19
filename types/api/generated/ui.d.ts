/**
 * Auto-generated from sandkit-api/runtime-dump.json
 * Run: npm run generate-types
 * Toast, overlays, dialogs
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiUi {
  /** Show an alert dialog. */
  alert: (message: string, title: string) => Promise<void>;
  /** Show a confirm dialog. */
  confirm: (message: string, title: string) => Promise<boolean>;
  /**
   * Mount a React component into the game UI tree.
   * @param componentId component id.
   * @param component component string.
   */
  inject: (componentId: string, component: (...args: unknown[]) => unknown) => (() => void) | undefined;
  navigation: ApiUiNavigation;
  /** open Pause Menu. */
  openPauseMenu: () => void;
  overlays: ApiUiOverlays;
  /**
   * Show a prompt dialog.
   * @param defaultValue default Value string.
   * @param allowCopy allow Copy flag.
   */
  prompt: (message: string, defaultValue: string, placeholder: string, title: string, allowCopy: boolean) => Promise<string | null>;
  /** show Tooltip. */
  showTooltip: (data: Record<string, unknown>) => void;
  /**
   * Show a toast notification.
   * @param options Optional settings object.
   */
  toast: (message: string, options: Record<string, unknown>) => void;
  /**
   * Update a definition.
   * @param componentId component id.
   * @param options Optional settings object.
   */
  update: (componentId: string, options: Record<string, unknown>) => void;
}
export interface ApiUiNavigation {
  /**
   * Return string.
   * @param focused focused flag.
   */
  controllerFocusClass: (focused: boolean) => string;
  useFocusable: (options: Record<string, unknown>) => void;
  /**
   * use Focus Scope.
   * @param options Optional settings object.
   */
  useFocusScope: (options: Record<string, unknown>) => void;
}
export interface ApiUiOverlays {
  /**
   * Register a definition.
   * @param slot slot string.
   * @param overlayId overlay id.
   */
  register: (slot: string, overlayId: string, render: (...args: unknown[]) => unknown) => void;
  /**
   * unregister.
   * @param slot slot string.
   * @param overlayId overlay id.
   */
  unregister: (slot: string, overlayId: string) => void;
  /**
   * Update a definition.
   * @param slot slot string.
   */
  update: (slot: string) => void;
}
export type ApiUiNamespace = ApiUi;
