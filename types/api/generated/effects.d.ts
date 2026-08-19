/**
 * Auto-generated from types/api/runtime-dump.json
 * Run: npm run generate-types
 * Particles, lights, lasers
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ApiHandler, Method0, Method1, Method2, Method3, Method4, Method5, Method6 } from "../common";
export interface ApiEffects {
  createDistortionWaveAtWorld: Method3;
  createEffectAtWorld: Method4;
  createLaserAtWorld: Method5;
  createLightAtWorld: Method3;
  createParticlesAtWorld: Method3;
  removeLightById: Method1;
}
export type ApiEffectsNamespace = ApiEffects;
