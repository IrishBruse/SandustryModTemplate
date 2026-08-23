/**
 * Game settings read and change notifications.
 *
 * Available as `sandkit.api.settings`.
 *
 * @module
 */
export namespace settings {
  /** Return a settings field value by id. */
  export function get(fieldId: string): ConfigValueV1 | undefined;
  /** Return all settings as a read-only map. */
  export function getAll(): Readonly<Record<string, ConfigValueV1>>;
  /** Subscribe to settings changes. Return an unsubscribe function. */
  export function onChange(callback: (values: Readonly<Record<string, ConfigValueV1>>) => void): () => void;

  /** Settings field value shape. */
  export type ConfigValueV1 = unknown
}
