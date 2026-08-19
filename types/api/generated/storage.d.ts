/**
 * Auto-generated from types/api/runtime-dump.json
 * Run: npm run generate-types
 * Mod and local storage
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ApiHandler, Method0, Method1, Method2, Method3, Method4, Method5, Method6 } from "../common";
export interface ApiStorage {
  ensure: Method1;
  get: Method2;
  local: ApiStorageLocal;
  remove: Method2;
  set: Method3;
}
export interface ApiStorageLocal {
  get: Method1;
  remove: Method1;
  set: Method2;
}
export type ApiStorageNamespace = ApiStorage;
