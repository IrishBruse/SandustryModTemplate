/**
 * Element contact reaction recipe registration.
 *
 * Available as `sandkit.api.reactions`.
 *
 * @module
 */
import type { elements } from "./elements";

export namespace reactions {
  /**
   * Register a contact reaction between elements.
   * @param definition - Contact recipe inputs, outputs, and orientation.
   */
  export function registerContact(definition: ContactRecipeDefinitionV1): void;

  /** Contact reaction recipe definition. */
  export interface ContactRecipeDefinitionV1 {
    /** First reacting element type. */
    inputA: elements.ElementType;
    /** Second reacting element type. */
    inputB: elements.ElementType;
    /** Element type produced from input A, or null for no output. */
    outputA: elements.ElementType | null;
    /** Element type produced from input B, or null for no output. */
    outputB: elements.ElementType | null;
    /** Contact layout requirement. Default `"any"`. */
    orientation?: "any" | "stacked";
  }
}
