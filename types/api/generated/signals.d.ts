/**
 * Auto-generated from types/api/runtime-dump.json
 * Run: npm run generate-types
 * Signal target registration
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ApiHandler, Method0, Method1, Method2, Method3, Method4, Method5, Method6 } from "../common";
export interface ApiSignals {
  targets: ApiSignalsTargets;
}
export interface ApiSignalsTargets {
  register: Method2;
}
export type ApiSignalsNamespace = ApiSignals;
