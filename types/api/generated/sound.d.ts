/**
 * Auto-generated from types/api/runtime-dump.json
 * Run: npm run generate-types
 * Sound playback
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ApiHandler, Method0, Method1, Method2, Method3, Method4, Method5, Method6 } from "../common";
export interface ApiSound {
  calculateDistanceOptionsAtWorld: Method3;
  play: Method2;
  playActive: Method2;
  playLayers: Method2;
  stopActive: Method0;
  stopAll: Method0;
  stopById: Method1;
}
export type ApiSoundNamespace = ApiSound;
