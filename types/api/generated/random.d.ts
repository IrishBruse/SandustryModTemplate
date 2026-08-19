/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * RNG
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiRandom {
  /**
   * Return number.
   * @param min min.
   * @param max max.
   */
  float: (min: number, max: number) => number;
  /**
   * Return number.
   * @param min min.
   * @param max max.
   */
  int: (min: number, max: number) => number;
}
export type ApiRandomNamespace = ApiRandom;
