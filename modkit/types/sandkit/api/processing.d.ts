export namespace processing {
  export function registerGrower(definition: PlanterBoxRecipeDefinitionV1): void;
  export function registerShaker(definition: ShakerRecipeDefinitionV1): void;
  export function registerKineticPress(definition: KineticPressRecipeDefinitionV1): void;

  export type PlanterBoxRecipeDefinitionV1 = unknown
  export type ShakerRecipeDefinitionV1 = unknown
  export type KineticPressRecipeDefinitionV1 = unknown
}