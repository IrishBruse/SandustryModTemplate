/**
 * Shared `sandkit.api.ui` base — lightweight UI helpers available on workers.
 *
 * Main thread adds richer UI APIs on top of this shape.
 *
 * @internal Base namespace reused by main and worker declarations.
 */
export namespace ui {
  /**
   * Show a short on-screen toast message.
   * @param message - Plain text, translation key, or translatable value.
   * @param options - Cooldown, style, and auto-dismiss options.
   */
  export function toast(message: LocalizedText, options?: ToastOptions): void;

  /** Plain text, translation key object, or i18n translatable value. */
  export type LocalizedText =
    | string
    | I18nTextKey
    | I18nTranslatable;

  /** Translation key with optional parameter substitution. */
  export interface I18nTextKey {
    /** Namespaced translation key (for example `ui|save|save`). */
    key: string;
    /** Values merged into the translated string. */
    params?: Record<string, string | number>;
  }

  /** Value returned by `sandkit.api.i18n.translatable`. */
  export interface I18nTranslatable {
    __translatable: true;
    key: string;
    fallback: string;
  }

  /** Cooldown, style, and auto-dismiss options for {@link toast}. */
  export interface ToastOptions {
    /** Minimum ms before the same toast can show again. */
    cooldown?: number;
    /**
     * Dedupe key paired with {@link ToastOptions.cooldown}.
     * Defaults to the message string or `message.key`.
     */
    cooldownKey?: string;
    /**
     * Auto-dismiss delay in ms. Default `5000`.
     * Set `false` to keep the toast until another toast replaces it.
     */
    duration?: number | false;
    /** Visual style applied to the toast body. */
    variant?: "danger" | "hint" | "hole" | (string & {});
  }
}
