/**
 * Vector math helpers for world and cell coordinates.
 *
 * Available as `sandkit.api.utils`.
 *
 * @module
 */
import type { Vector2 } from "../../shared/player";

export namespace utils {
  /** Return distance between two points. */
  export function getDistance(pointA: Vector2, pointB: Vector2): number;
  /** Return normalized direction from point A to point B. */
  export function getDirection(pointA: Vector2, pointB: Vector2): Vector2;
  /** Return angle in radians from point A to point B. */
  export function getAngle(pointA: Vector2, pointB: Vector2): number;
  /** Return grid cells along a line between two points. */
  export function getCoordinatesBetweenPoints(pointA: Vector2, pointB: Vector2): Vector2[];
}
