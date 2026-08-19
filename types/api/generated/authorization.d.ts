/**
 * Auto-generated from types/api/runtime-dump.json
 * Run: npm run generate-types
 * Build/grab/tool permissions
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ApiHandler, Method0, Method1, Method2, Method3, Method4, Method5, Method6 } from "../common";
export interface ApiAuthorization {
  /**
   * Return whether the player can build at a cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  canBuildAtCell: Method2;
  canGrabAtCell: Method2;
  canUseTool: Method2;
  canUseToolAtCell: Method3;
  getPlayerZoneId: Method0;
  getZoneIdAtCell: Method2;
}
export type ApiAuthorizationNamespace = ApiAuthorization;
