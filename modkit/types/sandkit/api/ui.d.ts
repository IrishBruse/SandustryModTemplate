import type { ComponentType, ReactNode, RefObject } from "react";
import { ui as sharedUI } from "../../shared/api/ui";
export namespace ui {
  export import toast = sharedUI.toast;
  export import LocalizedText = sharedUI.LocalizedText;
  export import ToastOptions = sharedUI.ToastOptions;

  export function update(componentId: ComponentId, options?: any): void;
  export function openPauseMenu(): void;
  export function showTooltip(data: TooltipData): void;
  export function alert(message: LocalizedText, title?: LocalizedText): Promise<void>;
  export function confirm(message: LocalizedText, title?: LocalizedText): Promise<boolean>;
  export function prompt(message: LocalizedText, defaultValue?: string, placeholder?: LocalizedText, title?: LocalizedText, allowCopy?: boolean): Promise<string | null>;
  export function inject(componentId: string, component: ComponentType<Record<string, never>>): () => void;

  export namespace overlays {
    export function register(slot: string, overlayId: string, render: () => ReactNode): void;
    export function unregister(slot: string, overlayId: string): void;
    export function update(slot: string): void;
  }

  export namespace navigation {
    export function useFocusable<T extends HTMLElement = HTMLDivElement>(options: FocusOptions): Focusable<T>;
    export function useFocusScope(options: { readonly id: string; readonly active: boolean; readonly priority?: number; readonly defaultId?: string; readonly onBack?: (() => boolean | void); }): void;
    export function controllerFocusClass(focused: boolean): string;
  }

  export type ComponentId = unknown
  export type TooltipData = unknown
  
  export interface Focusable<T extends HTMLElement = HTMLDivElement> {
    readonly ref: RefObject<T>;
    readonly focused: boolean;
    readonly focus: () => void;
  }

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
