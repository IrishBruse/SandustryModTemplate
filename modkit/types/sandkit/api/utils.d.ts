/**
 * Vector math helpers for world and cell coordinates.
 *
 * Available as `sandkit.api.utils`.
 *
 * @module
 */
import type { Vector2 } from "../../shared/player";

export namespace utils {
  /**
   * Return distance between two points.
   * @param pointA - First point.
   * @param pointB - Second point.
   */
  export function getDistance(pointA: Vector2, pointB: Vector2): number;
  /**
   * Return normalized direction from point A to point B.
   * @param pointA - Origin point.
   * @param pointB - Target point.
   */
  export function getDirection(pointA: Vector2, pointB: Vector2): Vector2;
  /**
   * Return angle in radians from point A to point B.
   * @param pointA - Origin point.
   * @param pointB - Target point.
   */
  export function getAngle(pointA: Vector2, pointB: Vector2): number;
  /**
   * Return grid cells along a line between two points.
   * @param pointA - Line start in cell or world coordinates.
   * @param pointB - Line end in cell or world coordinates.
   */
  export function getCoordinatesBetweenPoints(pointA: Vector2, pointB: Vector2): Vector2[];
}
