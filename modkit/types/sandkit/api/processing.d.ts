/**
 * Register processing recipes for grower, shaker, and kinetic press structures.
 *
 * Available as `sandkit.api.processing`.
 *
 * @module
 */
export namespace processing {
  /** Register a planter box grower recipe. */
  export function registerGrower(definition: PlanterBoxRecipeDefinitionV1): void;
  /** Register a shaker recipe. */
  export function registerShaker(definition: ShakerRecipeDefinitionV1): void;
  /** Register a kinetic press recipe. */
  export function registerKineticPress(definition: KineticPressRecipeDefinitionV1): void;

  /** Planter box recipe definition shape. */
  export type PlanterBoxRecipeDefinitionV1 = unknown
  /** Shaker recipe definition shape. */
  export type ShakerRecipeDefinitionV1 = unknown
  /** Kinetic press recipe definition shape. */
  export type KineticPressRecipeDefinitionV1 = unknown
}
