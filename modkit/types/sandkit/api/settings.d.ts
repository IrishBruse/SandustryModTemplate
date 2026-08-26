import type { LooseString } from "../../shared/nominal";

/**
 * Game settings read and change notifications.
 *
 * Available as `sandkit.api.settings`.
 *
 * @module
 */
export namespace settings {
  /**
   * Return a settings field value by id.
   * @param fieldId - Settings field identifier.
   */
  export function get(fieldId: FieldId): ConfigValueV1 | undefined;
  /** Return all settings as a read-only map. */
  export function getAll(): Readonly<Record<string, ConfigValueV1>>;
  /**
   * Subscribe to settings changes. Return an unsubscribe function.
   * @param callback - Called with the full settings map after a change.
   */
  export function onChange(callback: (values: Readonly<Record<string, ConfigValueV1>>) => void): () => void;

  /** Settings field id. Any string is allowed. */
  export type FieldId = LooseString<never>;

  /** Settings field value shape. */
  export type ConfigValueV1 = string | number | boolean | null;
}
