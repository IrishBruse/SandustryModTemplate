/**
 * Auto-generated from types/api/runtime-dump.json
 * Run: npm run generate-types
 * Cross-thread shared buffers
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ApiHandler, Method0, Method1, Method2, Method3, Method4, Method5, Method6 } from "../common";
export interface ApiShared {
  buffers: ApiSharedBuffers;
}
export interface ApiSharedBuffers {
  create: Method2;
  get: Method1;
}
export type ApiSharedNamespace = ApiShared;
