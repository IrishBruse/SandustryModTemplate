/**
 * `sandkit.api.excavation` — register custom excavation tool dig profiles.
 * Main thread only.
 */
export namespace excavation {
  /** Registers an excavation profile by id. */
  export function registerProfile(id: string, definition: ExcavationProfileDefinitionV1): void;

  /** Excavation tool profile definition. */
  export interface ExcavationProfileDefinitionV1 {
    /** Dig pattern grid; non-zero cells are removed. */
    pattern: number[][];
    /** Dig strength applied to matched cells. */
    power: number;
    /** Optional profile-specific options. */
    options?: Record<string, unknown>;
  }
}
