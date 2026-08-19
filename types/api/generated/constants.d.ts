/**
 * Auto-generated from types/api/runtime-dump.json
 * Run: npm run generate-types
 * Physics constants
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ApiHandler, Method0, Method1, Method2, Method3, Method4, Method5, Method6 } from "../common";
export interface ApiConstants {
  physics: ApiConstantsPhysics;
}
export interface ApiConstantsPhysics {
  aggressiveSkip: number;
  normal: number;
  skip: number;
}
export type ApiConstantsNamespace = ApiConstants;
