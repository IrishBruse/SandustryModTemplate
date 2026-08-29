const SAFE_FALL_CELLS = 28;
/** Damage per cell of drop beyond {@link SAFE_FALL_CELLS}. */
const DAMAGE_PER_EXTRA_CELL = 2;

let airborne = false;
let apexY = 0;

/** Health lost for a vertical drop in pixels. Jumps stay under the safe height. */
export function fallDamageForDrop(dropPx: number, gridCellSize: number): number {
  if (!(dropPx > 0) || !(gridCellSize > 0)) return 0;
  const extraCells = dropPx / gridCellSize - SAFE_FALL_CELLS;
  if (extraCells <= 0) return 0;
  return Math.round(extraCells * DAMAGE_PER_EXTRA_CELL);
}

export function resetFallDamage(): void {
  airborne = false;
  apexY = 0;
}

export type FallDamageTick = {
  /** Simulation step duration in seconds. `0` is a teleport. */
  dt?: number;
  /** Player hitbox top edge in world pixels. */
  y: number;
  onGround: boolean;
  isHovering?: boolean;
  cellSize: number;
};

/**
 * Track apex while airborne and return landing damage.
 * Call after collision (`player:moved`). Landing already zeroes `velocity.y`.
 */
export function tickFallDamage(tick: FallDamageTick): number {
  if (tick.dt === 0 || tick.isHovering) {
    resetFallDamage();
    return 0;
  }

  if (!tick.onGround) {
    if (!airborne) {
      airborne = true;
      apexY = tick.y;
      return 0;
    }
    if (tick.y < apexY) apexY = tick.y;
    return 0;
  }

  if (!airborne) return 0;
  airborne = false;
  return fallDamageForDrop(tick.y - apexY, tick.cellSize);
}
