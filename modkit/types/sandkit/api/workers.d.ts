/**
 * Worker thread post-update scheduling control.
 *
 * Available as `sandkit.api.workers`.
 *
 * @module
 */
export namespace workers {
  /** Enable or disable worker post-update callbacks. */
  export function setPostUpdateEnabled(enabled: boolean): void;
}
