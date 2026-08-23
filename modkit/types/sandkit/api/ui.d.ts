/**
 * UI overlays, dialogs, tooltips, and controller navigation hooks.
 *
 * Available as `sandkit.api.ui`.
 *
 * @module
 */
import type { ComponentType, ReactNode, RefObject } from "react";
import type { ComponentId as ComponentIdEnum } from "../enums/index";
import { shared } from "../../shared";

export namespace ui {
  /** Show a toast message. */
  export import toast = shared.api.ui.toast;
  /** Localized text value for UI strings. */
  export import LocalizedText = shared.api.ui.LocalizedText;
  /** Options for toast display. */
  export import ToastOptions = shared.api.ui.ToastOptions;

  /**
   * Update a registered UI component by id.
   * @param componentId - Built-in {@link ComponentIdEnum} value or custom string id.
   * @param options - Component-specific update payload.
   */
  export function update(componentId: ComponentId, options?: ComponentUpdateOptions): void;

  /** Open the pause menu. */
  export function openPauseMenu(): void;

  /**
   * Show a tooltip with the given data.
   * @param data - Tooltip type and localized content.
   */
  export function showTooltip(data: TooltipData): void;

  /**
   * Show an alert dialog.
   * @param message - Dialog body text.
   * @param title - Optional dialog title.
   * @returns Promise that resolves when the user dismisses the dialog.
   */
  export function alert(message: LocalizedText, title?: LocalizedText): Promise<void>;

  /**
   * Show a confirm dialog.
   * @param message - Dialog body text.
   * @param title - Optional dialog title.
   * @returns Promise that resolves with true when confirmed, or false when cancelled.
   */
  export function confirm(message: LocalizedText, title?: LocalizedText): Promise<boolean>;

  /**
   * Show a prompt dialog.
   * @param message - Dialog body text.
   * @param defaultValue - Initial input value.
   * @param placeholder - Placeholder text in the input field.
   * @param title - Optional dialog title.
   * @param allowCopy - When true, allow copying the result from the dialog.
   * @returns Promise that resolves with entered text, or null when cancelled.
   */
  export function prompt(message: LocalizedText, defaultValue?: string, placeholder?: LocalizedText, title?: LocalizedText, allowCopy?: boolean): Promise<string | null>;

  /**
   * Mount a React component by id.
   * @param componentId - Overlay slot or custom mount point id.
   * @param component - React component to render.
   * @returns Function that unmounts the injected component.
   */
  export function inject(componentId: ComponentId, component: ComponentType<Record<string, never>>): () => void;

  /** Overlay slot registration and updates. */
  export namespace overlays {
    /**
     * Register a render function in an overlay slot.
     * @param slot - Slot name (for example `"hotbar"`).
     * @param overlayId - Unique id for this overlay within the slot.
     * @param render - Function that returns React content.
     */
    export function register(slot: string, overlayId: string, render: () => ReactNode): void;

    /**
     * Remove an overlay from a slot.
     * @param slot - Slot name the overlay was registered in.
     * @param overlayId - Overlay id passed to {@link register}.
     */
    export function unregister(slot: string, overlayId: string): void;

    /**
     * Request a re-render for all overlays in a slot.
     * @param slot - Slot name to refresh.
     */
    export function update(slot: string): void;
  }

  /** Controller focus and scope navigation hooks. */
  export namespace navigation {
    /**
     * React hook for a focusable UI element in a scope.
     * @param options - Focus registration and neighbor wiring.
     * @returns Ref, focus state, and a focus helper.
     */
    export function useFocusable<T extends HTMLElement = HTMLDivElement>(options: FocusOptions): Focusable<T>;

    /**
     * React hook to register a focus scope with back handling.
     * @param options - Scope id, priority, default focus, and back handler.
     */
    export function useFocusScope(options: { readonly id: string; readonly active: boolean; readonly priority?: number; readonly defaultId?: string; readonly onBack?: (() => boolean | void); }): void;

    /**
     * Return CSS class for controller focus ring state.
     * @param focused - True when the element has controller focus.
     * @returns Class name string for the focus ring.
     */
    export function controllerFocusClass(focused: boolean): string;
  }

  /** Registered UI component id (built-in enum value or custom string). */
  export type ComponentId = ComponentIdEnum | string;

  /** Component-specific update payload passed to {@link update}. */
  export type ComponentUpdateOptions = Record<string, unknown>;

  /** Tooltip payload shown near the cursor or UI target. */
  export type TooltipData = TooltipMessageData;

  /** Message tooltip with localized body text. */
  export interface TooltipMessageData {
    /** Discriminator for tooltip renderer selection. */
    type: 'message';
    /** Message body as localized text. */
    text: LocalizedText;
  }

  /** Focusable element state from useFocusable. */
  export interface Focusable<T extends HTMLElement = HTMLDivElement> {
    /** Ref to attach to the focusable element. */
    readonly ref: RefObject<T>;
    /** True when the element has controller focus. */
    readonly focused: boolean;
    /** Move controller focus to this element. */
    readonly focus: () => void;
  }

  /** Options for useFocusable registration. */
  export interface FocusOptions {
    /** Unique id within the focus scope. */
    readonly id: string;
    /** Focus scope id this element belongs to. */
    readonly scope: string;
    /** Called when the element is activated (A button / Enter). */
    readonly onActivate: (element?: HTMLElement) => void;
    /** Called when the element receives focus. */
    readonly onFocus?: (() => void);
    /** When true, skip this element during navigation. */
    readonly disabled?: boolean;
    /** Optional grid column for spatial navigation. */
    readonly x?: number;
    /** Optional grid row for spatial navigation. */
    readonly y?: number;
    /** Neighbor ids for directional navigation. */
    readonly neighbors?: Partial<Record<'left' | 'right' | 'up' | 'down', string>>;
    /** When true, scroll the element into view on focus. */
    readonly scrollIntoView?: boolean;
  }
}
