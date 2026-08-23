import { CellCoordinates, Player } from "../../shared/player";

export namespace authorization {
  export function canBuildAtCell(...args: CellCoordinates): boolean;
  export function canGrabAtCell(...args: CellCoordinates): boolean;
  export function canUseTool(player: Player, isFlamethrower?: boolean): boolean;
  export function canUseToolAtCell(...args: [...CellCoordinates, isFlamethrower?: boolean]): boolean;
  export function getZoneIdAtCell(...args: CellCoordinates): number;
  export function getPlayerZoneId(): number;
}