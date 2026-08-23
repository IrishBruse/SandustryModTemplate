/**
 * JSON-serializable value shapes for mod payloads and storage.
 *
 * Used by APIs such as `sandkit.api.gameConfig` and mod storage helpers when
 * values must round-trip through JSON.
 *
 * @internal Base types reused by API declarations. Not a runtime namespace.
 */

/**
 * JSON object with string keys and {@link JsonValueV1} values.
 *
 * Use for open-ended config bags and serialized mod data.
 */
export interface JsonObjectV1 {
  [key: string]: JsonValueV1
}

/**
 * JSON value: primitive, object, array, or null.
 *
 * Does not include `undefined` — omit keys instead.
 */
export type JsonValueV1 =
  | string
  | number
  | boolean
  | JsonObjectV1
  | JsonValueV1[]
  | null;
