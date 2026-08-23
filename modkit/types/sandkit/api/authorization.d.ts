import { CellCoordinates, Player } from "../../shared/player";

/**
 * `sandkit.api.authorization` — player permission checks for build, grab, and tools.
 * Main thread only.
 */
export namespace authorization {
  /**
   * Return true when the player may place a structure at the cell.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @returns True when building is allowed in the authorization zone.
   */
  export function canBuildAtCell(...args: CellCoordinates): boolean;

  /**
   * Return true when the player may grab at the cell.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @returns True when grabbing is allowed in the authorization zone.
   */
  export function canGrabAtCell(...args: CellCoordinates): boolean;

  /**
   * Return true when the player may use a tool.
   * @param player - Player state snapshot.
   * @param isFlamethrower - When true, apply flamethrower-specific rules.
   * @returns True when tool use is allowed for the player.
   */
  export function canUseTool(player: Player, isFlamethrower?: boolean): boolean;

  /**
   * Return true when the player may use a tool at the cell.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @param isFlamethrower - When true, apply flamethrower-specific rules.
   * @returns True when tool use is allowed at the cell.
   */
  export function canUseToolAtCell(...args: [...CellCoordinates, isFlamethrower?: boolean]): boolean;

  /**
   * Return the authorization zone id at the cell.
   * @param cellX - Grid column of the target cell.
   * @param cellY - Grid row of the target cell.
   * @returns Numeric zone id for the cell.
   */
  export function getZoneIdAtCell(...args: CellCoordinates): number;

  /**
   * Return the authorization zone id for the player.
   * @returns Numeric zone id for the player's current position.
   */
  export function getPlayerZoneId(): number;
}
