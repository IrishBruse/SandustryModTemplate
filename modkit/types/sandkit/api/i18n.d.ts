export namespace i18n {
  export function t(key: string, params?: Record<string, string | number>): string;
  export function register(locale: string, translations: Record<string, string>): void;
  export function getLocale(): string;
  export function hasTranslation(key: string, locale?: string): boolean;
  export function setLocale(locale: string): Promise<void>;
  export function getLanguages(): { code: string; nativeName: string; englishName: string; enabled: boolean; }[];
  export function getAvailableLocales(): string[];
  export function formatNumber(value: number, options?: I18nNumberFormatOptions): string;
  export function key(...parts: string[]): string;
  export function getName(definition: { nameKey?: string; name?: string; }): string;
  export function getDescription(definition: { descriptionKey?: string; description?: string; }): string;
  export function translatable(key: string, fallback: string): { __translatable: true; key: string; fallback: string; };
  export function setGlobal(key: string, value: string | (() => string)): void;
  export function getGlobal(key: string): string | undefined;
  export function clearGlobal(key: string): void;
  export function getGlobals(): Record<string, string>;
  export function formatKeyForDisplay(keyCode: string): string;

  // TODO
  export type I18nNumberFormatOptions = unknown
}