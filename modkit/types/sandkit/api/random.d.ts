/**
 * Deterministic game random number helpers.
 *
 * Available as `sandkit.api.random`.
 *
 * @module
 */
export namespace random {
  /** Return a random integer in the inclusive range. */
  export function int(min: number, max: number): number;
  /** Return a random float in the inclusive range. */
  export function float(min: number, max: number): number;
}
