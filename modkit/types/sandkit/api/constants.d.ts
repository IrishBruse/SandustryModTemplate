/**
 * Physics skip modes used with element skip-physics fields.
 *
 * Available as `sandkit.api.constants.physics` (confirmed against Sandustry 0.5.2).
 *
 * @module
 */
export namespace constants {
  /**
   * Skip-physics modes for element physics fields.
   */
  export const physics: Readonly<{
    /** Run physics every tick. */
    normal: 0;
    /** Skip some physics updates. */
    skip: 1;
    /** Skip more aggressively than `skip`. */
    aggressiveSkip: 2;
  }>;
}
