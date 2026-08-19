/**
 * Auto-generated from types/api/runtime-dump.json
 * Run: npm run generate-types
 * Key bindings and mouse
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ApiHandler, Method0, Method1, Method2, Method3, Method4, Method5, Method6 } from "../common";
export interface ApiInput {
  getBoundKeys: Method1;
  getDisplayKey: Method2;
  getMouseCellPosition: Method0;
  isAltHeld: Method0;
  isCtrlHeld: Method0;
  pressBinding: Method1;
  registerBinding: Method3;
  releaseBinding: Method1;
  resetMouseState: Method0;
  triggerBinding: Method1;
}
export type ApiInputNamespace = ApiInput;
