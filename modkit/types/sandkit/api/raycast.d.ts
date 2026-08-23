/**
 * World raycast queries from a start point and angle.
 *
 * Available as `sandkit.api.raycast`.
 *
 * @module
 */
import type { Vector2 } from "../../shared/player";

export namespace raycast {
  /** Cast a ray from world position. Return hit point and distance, or null. */
  export function castFromWorld(startWorldX: number, startWorldY: number, angle: number, maxDistance: number): Vector2 & { distance: number; } | null;
}
