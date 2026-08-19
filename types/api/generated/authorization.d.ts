/**
 * Auto-generated from sandkit-api/runtime-dump.json
 * Run: npm run generate-types
 * Build/grab/tool permissions
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiAuthorization {
  /**
   * Return whether the player can build at a cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  canBuildAtCell: (cellX: number, cellY: number) => boolean;
  /**
   * Return whether can grab at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  canGrabAtCell: (cellX: number, cellY: number) => boolean;
  /**
   * Return whether can use tool.
   * @param isFlamethrower is Flamethrower flag.
   */
  canUseTool: (player: string, isFlamethrower: boolean) => boolean;
  /**
   * Return whether can use tool at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   * @param isFlamethrower is Flamethrower flag.
   */
  canUseToolAtCell: (cellX: number, cellY: number, isFlamethrower: boolean) => boolean;
  /** Return player zone id. */
  getPlayerZoneId: () => string;
  /**
   * Return zone id at cell.
   * @param cellX Cell X coordinate.
   * @param cellY Cell Y coordinate.
   */
  getZoneIdAtCell: (cellX: number, cellY: number) => string;
}
export type ApiAuthorizationNamespace = ApiAuthorization;
