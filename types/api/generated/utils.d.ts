/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Math helpers
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiUtils {
  /**
   * Return angle.
   * @param pointA point A.
   * @param pointB point B.
   */
  getAngle: (pointA: { x: number; y: number; }, pointB: { x: number; y: number; }) => number;
  /**
   * Return coordinates between points.
   * @param pointA point A.
   * @param pointB point B.
   */
  getCoordinatesBetweenPoints: (pointA: { x: number; y: number; }, pointB: { x: number; y: number; }) => { x: number; y: number; }[];
  /**
   * Return direction.
   * @param pointA point A.
   * @param pointB point B.
   */
  getDirection: (pointA: { x: number; y: number; }, pointB: { x: number; y: number; }) => { x: number; y: number; };
  /** Return distance. */
  getDistance: (pointA: { x: number; y: number; }, pointB: { x: number; y: number; }) => number;
}
export type ApiUtilsNamespace = ApiUtils;
