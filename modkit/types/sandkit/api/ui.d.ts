/**
 * UI overlays, dialogs, tooltips, and controller navigation hooks.
 *
 * Available as `sandkit.api.ui`.
 *
 * @module
 */
import type { ComponentType, ReactNode, RefObject } from "react";
import { ui as sharedUI } from "../../shared/api/ui";
export namespace ui {
  /** Show a toast message. */
  export import toast = sharedUI.toast;
  /** Localized text value for UI strings. */
  export import LocalizedText = sharedUI.LocalizedText;
  /** Options for toast display. */
  export import ToastOptions = sharedUI.ToastOptions;

  /** Update a registered UI component by id. */
  export function update(componentId: ComponentId, options?: any): void;
  /** Open the pause menu. */
  export function openPauseMenu(): void;
  /** Show a tooltip with the given data. */
  export function showTooltip(data: TooltipData): void;
  /** Show an alert dialog. Resolve when dismissed. */
  export function alert(message: LocalizedText, title?: LocalizedText): Promise<void>;
  /** Show a confirm dialog. Resolve with true or false. */
  export function confirm(message: LocalizedText, title?: LocalizedText): Promise<boolean>;
  /** Show a prompt dialog. Resolve with entered text or null. */
  export function prompt(message: LocalizedText, defaultValue?: string, placeholder?: LocalizedText, title?: LocalizedText, allowCopy?: boolean): Promise<string | null>;
  /** Mount a React component by id. Return an unmount function. */
  export function inject(componentId: string, component: ComponentType<Record<string, never>>): () => void;

  /** Overlay slot registration and updates. */
  export namespace overlays {
    /** Register a render function in an overlay slot. */
    export function register(slot: string, overlayId: string, render: () => ReactNode): void;
    /** Remove an overlay from a slot. */
    export function unregister(slot: string, overlayId: string): void;
    /** Request a re-render for all overlays in a slot. */
    export function update(slot: string): void;
  }

  /** Controller focus and scope navigation hooks. */
  export namespace navigation {
    /** React hook for a focusable UI element in a scope. */
    export function useFocusable<T extends HTMLElement = HTMLDivElement>(options: FocusOptions): Focusable<T>;
    /** React hook to register a focus scope with back handling. */
    export function useFocusScope(options: { readonly id: string; readonly active: boolean; readonly priority?: number; readonly defaultId?: string; readonly onBack?: (() => boolean | void); }): void;
    /** Return CSS class for controller focus ring state. */
    export function controllerFocusClass(focused: boolean): string;
  }

  /** Registered UI component id. */
  export type ComponentId = unknown
  /** Tooltip content and placement data. */
  export type TooltipData = unknown
  
  /** Focusable element state from useFocusable. */
  export interface Focusable<T extends HTMLElement = HTMLDivElement> {
    readonly ref: RefObject<T>;
    readonly focused: boolean;
    readonly focus: () => void;
  }

  /** Options for useFocusable registration. */
  export interface FocusOptions {
    readonly id: string;
    readonly scope: string;
    readonly onActivate: (element?: HTMLElement) => void;
    readonly onFocus?: (() => void);
    readonly disabled?: boolean;
    readonly x?: number;
    readonly y?: number;
    readonly neighbors?: Partial<Record<'left' | 'right' | 'up' | 'down', string>>;
    readonly scrollIntoView?: boolean;
  }
}
