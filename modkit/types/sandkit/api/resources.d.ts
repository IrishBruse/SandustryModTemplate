/**
 * Fluxite collection and energy updates.
 *
 * Available as `sandkit.api.resources`.
 *
 * @module
 */
import { CellCoordinates } from "../../shared/player";

export namespace resources {
  /** Collect fluxite at the given cell. */
  export function collectFluxiteAtCell(...args: CellCoordinates): void;
  /** Update stored energy by amount with optional UI deferral. */
  export function updateEnergy(amount: number, options?: { deferUi?: boolean; }): void;
}
