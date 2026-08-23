/**
 * Story and quest progression completion.
 *
 * Available as `sandkit.api.progression`.
 *
 * @module
 */

export namespace progression {
  /** Mark a progression step complete. Return true when completion succeeds. */
  export function complete(request: ProgressionCompletionRequestV1): boolean;
  /** Progression completion request shape. */
  export type ProgressionCompletionRequestV1 = unknown
}
