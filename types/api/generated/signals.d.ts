/**
 * Auto-generated from types/api/source/runtime-dump.json
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
  register: (structureTypeOrId: string | StructureType, apply: (structure: Structure, payload: SignalTargetPayloadV1) => void) => void;
}
export type ApiSignalsNamespace = ApiSignals;
