/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Translations
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiI18n {
  /**
   * clear Global.
   * @param key key string.
   */
  clearGlobal: (key: string) => void;
  /**
   * Return string.
   * @param keyCode key Code string.
   */
  formatKeyForDisplay: (keyCode: string) => string;
  /**
   * Return string.
   * @param value value.
   * @param options Optional settings object.
   */
  formatNumber: (value: number, options: Record<string, unknown>) => string;
  /** Return available locales. */
  getAvailableLocales: () => string[];
  /**
   * Return description.
   * @param definition Registration definition object.
   */
  getDescription: (definition: Record<string, unknown>) => string;
  /**
   * Return global.
   * @param key key string.
   */
  getGlobal: (key: string) => string;
  /** Return globals. */
  getGlobals: () => Record<string, string>;
  /** Return languages. */
  getLanguages: () => string[];
  /** Return locale. */
  getLocale: () => string;
  /**
   * Return name.
   * @param definition Registration definition object.
   */
  getName: (definition: Record<string, unknown>) => string;
  /**
   * Return whether translation exists.
   * @param key key string.
   * @param locale locale string.
   */
  hasTranslation: (key: string, locale: string) => boolean;
  /**
   * Return string.
   * @param parts parts string.
   */
  key: (parts: string) => string;
  /**
   * Register a definition.
   * @param locale locale string.
   * @param translations translations string.
   */
  register: (locale: string, translations: string) => void;
  /**
   * Set global.
   * @param key key string.
   * @param value value string.
   */
  setGlobal: (key: string, value: string) => void;
  /** Set locale. */
  setLocale: (arg0: unknown) => void;
  /**
   * Return string.
   * @param key key string.
   * @param params params.
   */
  t: (key: string, params: Record<string, unknown>) => string;
  /**
   * Return { __translatable: true; key: string; fallback: string; }.
   * @param key key string.
   * @param fallback fallback string.
   */
  translatable: (key: string, fallback: string) => { __translatable: true; key: string; fallback: string };
}
export type ApiI18nNamespace = ApiI18n;
