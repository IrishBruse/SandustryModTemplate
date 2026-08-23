import type { Vector2 } from "../../shared/player";

export namespace utils {
  export function getDistance(pointA: Vector2, pointB: Vector2): number;
  export function getDirection(pointA: Vector2, pointB: Vector2): Vector2;
  export function getAngle(pointA: Vector2, pointB: Vector2): number;
  export function getCoordinatesBetweenPoints(pointA: Vector2, pointB: Vector2): Vector2[];
}