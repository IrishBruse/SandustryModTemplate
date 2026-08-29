import { LOAD_DROP_MS, STATION_SIZE } from "../constants.ts";

export type LoadDrop = {
  id: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  bornMs: number;
  durationMs: number;
};

const drops: LoadDrop[] = [];
let nextId = 1;

export function resetLoadDrops(): void {
  drops.length = 0;
  nextId = 1;
}

export function spawnLoadDrop(
  structureX: number,
  structureY: number,
  cartX: number,
  cartY: number,
  now: number,
  rand: () => number = Math.random,
): void {
  if (drops.length >= 48) drops.shift();
  const span = STATION_SIZE;
  drops.push({
    id: nextId,
    fromX: structureX + 0.5 + rand() * (span - 1),
    fromY: structureY + STATION_SIZE - 0.2,
    toX: cartX + 2 + rand() * (span - 4),
    toY: cartY + 1.2,
    bornMs: now,
    durationMs: LOAD_DROP_MS,
  });
  nextId += 1;
}

export function getLoadDrops(): readonly LoadDrop[] {
  return drops;
}

export function pruneLoadDrops(now: number): void {
  for (let i = drops.length - 1; i >= 0; i -= 1) {
    if (now - drops[i].bornMs >= drops[i].durationMs) drops.splice(i, 1);
  }
}

/** Gravity-like ease: faster near the cart. */
export function loadDropPos(drop: LoadDrop, now: number): { x: number; y: number } {
  const t = Math.min(1, (now - drop.bornMs) / drop.durationMs);
  const fall = t * t;
  return {
    x: drop.fromX + (drop.toX - drop.fromX) * t,
    y: drop.fromY + (drop.toY - drop.fromY) * fall,
  };
}
