/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Intercept and modify hooks
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiHooks {
  intercept: (hookId: string, handler: (...args: unknown[]) => unknown, priority: number) => void;
  modify: (hookId: string, handler: (...args: unknown[]) => unknown, priority: number) => void;
}
export type ApiHooksNamespace = ApiHooks;
