import { CellCoordinates, Player } from "../../shared/player";

/**
 * `sandkit.api.authorization` — player permission checks for build, grab, and tools.
 * Main thread only.
 */
export namespace authorization {
  /** Returns true when the player may place a structure at the cell. */
  export function canBuildAtCell(...args: CellCoordinates): boolean;
  /** Returns true when the player may grab at the cell. */
  export function canGrabAtCell(...args: CellCoordinates): boolean;
  /** Returns true when the player may use a tool. */
  export function canUseTool(player: Player, isFlamethrower?: boolean): boolean;
  /** Returns true when the player may use a tool at the cell. */
  export function canUseToolAtCell(...args: [...CellCoordinates, isFlamethrower?: boolean]): boolean;
  /** Returns the authorization zone id at the cell. */
  export function getZoneIdAtCell(...args: CellCoordinates): number;
  /** Returns the authorization zone id for the player. */
  export function getPlayerZoneId(): number;
}
