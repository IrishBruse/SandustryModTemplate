/**
 * Auto-generated from types/api/source/runtime-dump.json
 * Run: npm run generate-types
 * Grower/shaker/press recipes
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApiProcessing {
  /**
   * Register grower.
   * @param definition Registration definition object.
   */
  registerGrower: (definition: PlanterBoxRecipeDefinitionV1) => void;
  /**
   * Register kinetic press.
   * @param definition Registration definition object.
   */
  registerKineticPress: (definition: KineticPressRecipeDefinitionV1) => void;
  /**
   * Register shaker.
   * @param definition Registration definition object.
   */
  registerShaker: (definition: ShakerRecipeDefinitionV1) => void;
}
export type ApiProcessingNamespace = ApiProcessing;
