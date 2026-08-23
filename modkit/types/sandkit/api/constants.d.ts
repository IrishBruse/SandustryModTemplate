/**
 * Physics skip modes used with element skip-physics fields.
 *
 * `sandkit.api.constants` — shared numeric constants for mod API use.
 * Main thread only.
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
