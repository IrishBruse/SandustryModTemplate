/**
 * Element contact reaction recipe registration.
 *
 * Available as `sandkit.api.reactions`.
 *
 * @module
 */
export namespace reactions {
  /** Register a contact reaction between elements. */
  export function registerContact(definition: ContactRecipeDefinitionV1): void;
  /** Contact reaction recipe definition shape. */
  export type ContactRecipeDefinitionV1 = unknown
}
