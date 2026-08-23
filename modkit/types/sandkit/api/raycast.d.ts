import type { Vector2 } from "../../shared/player";

export namespace raycast {
  export function castFromWorld(startWorldX: number, startWorldY: number, angle: number, maxDistance: number): Vector2 & { distance: number; } | null;
}
