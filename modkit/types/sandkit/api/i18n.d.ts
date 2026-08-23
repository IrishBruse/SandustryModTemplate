/**
 * `sandkit.api.i18n` — translations, locales, and display strings for mods.
 * Main thread only.
 */
export namespace i18n {
  /** Translates a key with optional parameter substitution. */
  export function t(key: string, params?: Record<string, string | number>): string;
  /** Registers translation strings for a locale. */
  export function register(locale: string, translations: Record<string, string>): void;
  /** Returns the active locale code. */
  export function getLocale(): string;
  /** Returns true when a translation exists for the key. */
  export function hasTranslation(key: string, locale?: string): boolean;
  /** Sets the active locale. */
  export function setLocale(locale: string): Promise<void>;
  /** Returns metadata for all known languages. */
  export function getLanguages(): { code: string; nativeName: string; englishName: string; enabled: boolean; }[];
  /** Returns locale codes that have registered translations. */
  export function getAvailableLocales(): string[];
  /** Formats a number for the active locale. */
  export function formatNumber(value: number, options?: I18nNumberFormatOptions): string;
  /** Joins key parts into a single translation key. */
  export function key(...parts: string[]): string;
  /** Returns the display name from a definition with nameKey or name. */
  export function getName(definition: { nameKey?: string; name?: string; }): string;
  /** Returns the description from a definition with descriptionKey or description. */
  export function getDescription(definition: { descriptionKey?: string; description?: string; }): string;
  /** Creates a translatable string object with a fallback. */
  export function translatable(key: string, fallback: string): { __translatable: true; key: string; fallback: string; };
  /** Sets a global string or lazy resolver used in translations. */
  export function setGlobal(key: string, value: string | (() => string)): void;
  /** Returns a global translation helper value. */
  export function getGlobal(key: string): string | undefined;
  /** Removes a global translation helper value. */
  export function clearGlobal(key: string): void;
  /** Returns all global translation helper values. */
  export function getGlobals(): Record<string, string>;
  /** Formats a key code for display in UI. */
  export function formatKeyForDisplay(keyCode: string): string;

  // TODO
  /** Number format options (not yet typed in declarations). */
  export type I18nNumberFormatOptions = unknown
}
