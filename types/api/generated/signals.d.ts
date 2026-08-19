/**
 * Auto-generated from sandkit-api/runtime-dump.json
 * Run: npm run generate-types
 * Signal target registration
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiSignals {
  targets: ApiSignalsTargets;
}
export interface ApiSignalsTargets {
  /**
   * Register a definition.
   * @param structureTypeOrId structure Type Or id.
   */
  register: (structureTypeOrId: string, apply: (...args: unknown[]) => unknown) => void;
}
export type ApiSignalsNamespace = ApiSignals;
