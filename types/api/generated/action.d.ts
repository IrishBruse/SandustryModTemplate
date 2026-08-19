/**
 * Auto-generated from sandkit-api/runtime-dump.json
 * Run: npm run generate-types
 * Active/selected tool actions
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiAction {
  /** Return active. */
  getActive: () => string;
  /** Return selected. */
  getSelected: () => string;
  /** Set custom data. */
  setCustomData: (data: Record<string, unknown>) => void;
}
export type ApiActionNamespace = ApiAction;
