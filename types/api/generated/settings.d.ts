/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Mod configSchema settings
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiSettings {
  /**
   * Return ConfigValueV1 | undefined.
   * @param fieldId field id.
   */
  get: (fieldId: string) => string | number | boolean | undefined;
  /** Return all. */
  getAll: () => Record<string, string | number | boolean>;
  /**
   * Return () => void.
   * @param callback Callback function.
   */
  onChange: (callback: (...args: unknown[]) => unknown) => void;
}
export type ApiSettingsNamespace = ApiSettings;
