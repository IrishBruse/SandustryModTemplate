/**
 * Auto-generated from types/api/runtime-dump.json
 * Run: npm run generate-types
 * Persistent and VFX lights
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ApiHandler, Method0, Method1, Method2, Method3, Method4, Method5, Method6 } from "../common";
export interface ApiLights {
  persistent: ApiLightsPersistent;
  vfx: ApiLightsVfx;
}
export interface ApiLightsPersistent {
  createAtWorld: Method3;
  fadeAtWorld: Method3;
  markDirty: Method0;
  removeAtWorld: Method2;
}
export interface ApiLightsVfx {
  createAtWorld: Method3;
  removeById: Method1;
}
export type ApiLightsNamespace = ApiLights;
