/**
 * Auto-generated from types/api/runtime-dump.json
 * Run: npm run generate-types
 * Toast, overlays, dialogs
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ApiHandler, Method0, Method1, Method2, Method3, Method4, Method5, Method6 } from "../common";
export interface ApiUi {
  alert: Method2;
  confirm: Method2;
  inject: Method2;
  navigation: ApiUiNavigation;
  openPauseMenu: Method0;
  overlays: ApiUiOverlays;
  prompt: Method5;
  showTooltip: Method1;
  toast: Method2;
  update: Method2;
}
export interface ApiUiNavigation {
  controllerFocusClass: Method1;
  useFocusable: Method1;
  useFocusScope: Method1;
}
export interface ApiUiOverlays {
  register: Method3;
  unregister: Method2;
  update: Method1;
}
export type ApiUiNamespace = ApiUi;
