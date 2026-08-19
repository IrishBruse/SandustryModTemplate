/**
 * Auto-generated from types/api/runtime-dump.json
 * Run: npm run generate-types
 * Grabber helpers
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ApiHandler, Method0, Method1, Method2, Method3, Method4, Method5, Method6 } from "../common";
export interface ApiTools {
  grabber: ApiToolsGrabber;
}
export interface ApiToolsGrabber {
  getSize: Method0;
  isActive: Method0;
  isLoaded: Method0;
  setSize: Method1;
}
export type ApiToolsNamespace = ApiTools;
