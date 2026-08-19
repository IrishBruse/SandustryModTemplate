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
  get: (fieldId: string) => ConfigValueV1 | undefined;
  /** Return all. */
  getAll: () => Readonly<Record<string, ConfigValueV1>>;
  /**
   * Return () => void.
   * @param callback Callback function.
   */
  onChange: (callback: (values: Readonly<Record<string, ConfigValueV1>>) => void) => () => void;
}
export type ApiSettingsNamespace = ApiSettings;
