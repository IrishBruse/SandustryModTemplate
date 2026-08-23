/**
 * `sandkit.api.excavation` — register custom excavation tool dig profiles.
 * Main thread only.
 */
export namespace excavation {
  /**
   * Registers an excavation profile by id.
   * @param id - Unique profile id (1–128 chars: letters, numbers, `.`, `_`, `:`, `-`).
   * @param definition - Pattern, power, and profile options.
   */
  export function registerProfile(id: string, definition: ExcavationProfileDefinitionV1): void;

  /** Excavation tool profile definition. */
  export interface ExcavationProfileDefinitionV1 {
    /** Dig pattern grid; non-zero cells are removed. */
    pattern: number[][];
    /** Dig strength applied to matched cells. Clamped to 0–1000. */
    power: number;
    /** Optional profile-specific excavation flags. */
    options?: ExcavationProfileOptions;
  }

  /** Options attached to an excavation profile definition. */
  export interface ExcavationProfileOptions {
    fromGun?: boolean;
    fromRocketExplosion?: boolean;
    fromDrill?: boolean;
    useLiteralOutVelocity?: boolean;
    destroyNonDestructible?: boolean;
    forceRemoveAll?: boolean;
    /** Clamped to 0–1000 when set. */
    drillTierDamage?: number;
  }
}
