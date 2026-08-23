/**
 * Register processing recipes for grower, shaker, and kinetic press structures.
 *
 * Available as `sandkit.api.processing`.
 *
 * @module
 */
import type { elements } from "./elements";

export namespace processing {
  /**
   * Register a planter box grower recipe.
   * @param definition - Grower input/output recipe.
   */
  export function registerGrower(definition: PlanterBoxRecipeDefinitionV1): void;

  /**
   * Register a shaker recipe.
   * @param definition - Shaker input and weighted outputs.
   */
  export function registerShaker(definition: ShakerRecipeDefinitionV1): void;

  /**
   * Register a kinetic press recipe.
   * @param definition - Press input, velocity threshold, and outputs.
   */
  export function registerKineticPress(definition: KineticPressRecipeDefinitionV1): void;

  /** Weighted element output entry shared by machine recipes. */
  export interface WeightedRecipeOutput {
    /** Output element type (1–255). */
    elementType: elements.ElementType;
    /** Output probability from 0 to 1. */
    chance: number;
  }

  /** Planter box grower recipe definition. */
  export interface PlanterBoxRecipeDefinitionV1 {
    /** Input element type placed on the grower. */
    input: elements.ElementType;
    /** Output element type produced by the grower. */
    output: elements.ElementType;
    /** Success chance from 0 to 1. Default 1. */
    chance?: number;
  }

  /** Shaker recipe definition. */
  export interface ShakerRecipeDefinitionV1 {
    /** Input element type dropped on the shaker. */
    input: elements.ElementType;
    /** Weighted outputs ejected upward. */
    outputsAbove: WeightedRecipeOutput[];
    /** Weighted outputs ejected downward. */
    outputsBelow: WeightedRecipeOutput[];
  }

  /** Kinetic press recipe definition. */
  export interface KineticPressRecipeDefinitionV1 {
    /** Input element type processed by the press. */
    input: elements.ElementType;
    /** Minimum downward velocity required to trigger the press. */
    minimumDownwardVelocity: number;
    /** Weighted outputs produced by the press. */
    outputs: WeightedRecipeOutput[];
  }
}
