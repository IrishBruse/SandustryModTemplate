/**
 * Story and quest progression completion.
 *
 * Available as `sandkit.api.progression`.
 *
 * @module
 */

export namespace progression {
  /**
   * Mark a progression step complete. Return true when completion succeeds.
   * @param request - Progression id and optional metadata for the step.
   */
  export function complete(request: ProgressionCompletionRequestV1): boolean;

  /** Progression completion request shape. */
  export interface ProgressionCompletionRequestV1 {
    /** Progression step or quest identifier. */
    id: string;
    [key: string]: unknown;
  }
}
