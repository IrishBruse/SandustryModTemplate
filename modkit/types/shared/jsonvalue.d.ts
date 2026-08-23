/**
 * JSON-serializable value shapes for mod payloads and storage.
 *
 * @internal Base types reused by API declarations. Not a runtime namespace.
 */

/** JSON object with string keys and {@link JsonValueV1} values. */
export interface JsonObjectV1 {
  [key: string]: JsonValueV1
}

/** JSON value: primitive, object, array, or null. */
export type JsonValueV1 = string | number | JsonObjectV1 | JsonValueV1[] | null;
