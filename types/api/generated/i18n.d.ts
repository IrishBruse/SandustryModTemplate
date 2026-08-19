/**
 * Auto-generated from types/api/runtime-dump.json
 * Run: npm run generate-types
 * Translations
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ApiHandler, Method0, Method1, Method2, Method3, Method4, Method5, Method6 } from "../common";
export interface ApiI18n {
  clearGlobal: Method1;
  formatKeyForDisplay: Method1;
  formatNumber: Method2;
  getAvailableLocales: Method0;
  getDescription: Method1;
  getGlobal: Method1;
  getGlobals: Method0;
  getLanguages: Method0;
  getLocale: Method0;
  getName: Method1;
  hasTranslation: Method2;
  key: Method1;
  register: Method2;
  setGlobal: Method2;
  setLocale: Method1;
  t: Method2;
  translatable: Method2;
}
export type ApiI18nNamespace = ApiI18n;
