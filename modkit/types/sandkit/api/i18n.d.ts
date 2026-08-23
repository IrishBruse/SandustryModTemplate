/**
 * `sandkit.api.i18n` — translations, locales, and display strings for mods.
 * Main thread only.
 */
export namespace i18n {
  /**
   * Translates a key with optional parameter substitution.
   * @param key - Translation key.
   * @param params - Placeholder values for the key template.
   */
  export function t(key: string, params?: Record<string, string | number>): string;
  /**
   * Registers translation strings for a locale.
   * @param locale - Locale code (e.g. `en`).
   * @param translations - Map of keys to translated strings.
   */
  export function register(locale: string, translations: Record<string, string>): void;
  /** Returns the active locale code. */
  export function getLocale(): string;
  /**
   * Returns true when a translation exists for the key.
   * @param key - Translation key.
   * @param locale - Optional locale; defaults to the active locale.
   */
  export function hasTranslation(key: string, locale?: string): boolean;
  /**
   * Sets the active locale.
   * @param locale - Locale code to activate.
   */
  export function setLocale(locale: string): Promise<void>;
  /** Returns metadata for all known languages. */
  export function getLanguages(): { code: string; nativeName: string; englishName: string; enabled: boolean; }[];
  /** Returns locale codes that have registered translations. */
  export function getAvailableLocales(): string[];
  /**
   * Formats a number for the active locale.
   * @param value - Number to format.
   * @param options - Intl-style number format options.
   */
  export function formatNumber(value: number, options?: I18nNumberFormatOptions): string;
  /**
   * Joins key parts into a single translation key.
   * @param parts - Key segments joined with `.`.
   */
  export function key(...parts: string[]): string;
  /**
   * Returns the display name from a definition with nameKey or name.
   * @param definition - Object with `nameKey` or `name`.
   */
  export function getName(definition: { nameKey?: string; name?: string; }): string;
  /**
   * Returns the description from a definition with descriptionKey or description.
   * @param definition - Object with `descriptionKey` or `description`.
   */
  export function getDescription(definition: { descriptionKey?: string; description?: string; }): string;
  /**
   * Creates a translatable string object with a fallback.
   * @param key - Translation key.
   * @param fallback - Text used when no translation is registered.
   */
  export function translatable(key: string, fallback: string): { __translatable: true; key: string; fallback: string; };
  /**
   * Sets a global string or lazy resolver used in translations.
   * @param key - Global helper key.
   * @param value - Static string or function that returns the current value.
   */
  export function setGlobal(key: string, value: string | (() => string)): void;
  /**
   * Returns a global translation helper value.
   * @param key - Global helper key.
   */
  export function getGlobal(key: string): string | undefined;
  /**
   * Removes a global translation helper value.
   * @param key - Global helper key.
   */
  export function clearGlobal(key: string): void;
  /** Returns all global translation helper values. */
  export function getGlobals(): Record<string, string>;
  /**
   * Formats a key code for display in UI.
   * @param keyCode - Keyboard key code or binding name.
   */
  export function formatKeyForDisplay(keyCode: string): string;

  /** Number format options for {@link formatNumber}. */
  export interface I18nNumberFormatOptions {
    /** Minimum fraction digits. */
    minimumFractionDigits?: number;
    /** Maximum fraction digits. */
    maximumFractionDigits?: number;
    /** When true, use grouping separators. */
    useGrouping?: boolean;
    [key: string]: unknown;
  }
}
