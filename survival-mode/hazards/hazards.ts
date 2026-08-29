import { isEnabled } from "@modkit/utils";
import { applyDamage } from "../health/health";
import {
  clearHazardSpriteEffect,
  type HazardKind,
  updateHazardSpriteEffect,
} from "./playerSpriteEffect";

const api = sandkit.api;
const { ElementType } = sandkit.enums;

/** Damage per tick while touching fire or flame. */
const FIRE_DAMAGE = 6;
/** Damage per tick while touching lava. */
const LAVA_DAMAGE = 12;
/** Time between hazard damage ticks while overlapping. */
const DAMAGE_TICK_MS = 400;

const damageCooldown = { last: 0, time: DAMAGE_TICK_MS };

type HitboxPlayer = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function isSurvivalActive(): boolean {
  return isEnabled(api);
}

function isGamePaused(): boolean {
  const session = sandkit.state.session as { paused?: boolean };
  return session.paused === true;
}

function playerHitbox(): HitboxPlayer | null {
  const store = sandkit.state.store as { player?: HitboxPlayer };
  return store.player ?? null;
}

function cellSize(): number {
  return api.rendering.getGridMetrics().cellSize ?? 4;
}

function detectHazard(): HazardKind | null {
  const player = playerHitbox();
  if (!player) return null;

  const size = cellSize();
  const minX = Math.floor(player.x / size);
  const maxX = Math.floor((player.x + player.width) / size);
  const minY = Math.floor(player.y / size);
  const maxY = Math.floor((player.y + player.height) / size);

  let inLava = false;
  let inFire = false;

  for (let cellY = minY; cellY <= maxY; cellY++) {
    for (let cellX = minX; cellX <= maxX; cellX++) {
      if (!api.player.isCollidingWithCell(cellX, cellY)) continue;

      const type = api.elements.getResolvedTypeAtCell(cellX, cellY);
      if (type === ElementType.Lava) {
        inLava = true;
      } else if (type === ElementType.Fire || type === ElementType.Flame) {
        inFire = true;
      }
    }
  }

  if (inLava) return "lava";
  if (inFire) return "fire";
  return null;
}

function applyHazardDamage(kind: HazardKind) {
  if (!api.cooldown.check(damageCooldown)) return;
  applyDamage(kind === "lava" ? LAVA_DAMAGE : FIRE_DAMAGE);
}

function tickHazards() {
  const hazard = detectHazard();
  updateHazardSpriteEffect(hazard);
  if (hazard) applyHazardDamage(hazard);
}

export function installHazardHooks(): () => void {
  const stopFrame = api.events.on("frame:render", () => {
    if (!isSurvivalActive()) {
      clearHazardSpriteEffect();
      return;
    }
    if (isGamePaused()) return;
    tickHazards();
  });

  return () => {
    stopFrame();
    clearHazardSpriteEffect();
  };
}
