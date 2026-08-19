/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Active/selected tool actions
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiAction {
  /** Return active. */
  getActive: () => Action;
  /** Return selected. */
  getSelected: () => Action;
  /** Set custom data. */
  setCustomData: (data: unknown) => void;
}
export type ApiActionNamespace = ApiAction;
