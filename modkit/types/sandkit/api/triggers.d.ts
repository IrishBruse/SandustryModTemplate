/**
 * Interval-based main-thread trigger registration.
 *
 * Available as `sandkit.api.triggers`.
 *
 * @module
 */
export namespace triggers {
  /**
   * Register a repeating trigger with interval and callback.
   * @param triggerId - Unique trigger identifier.
   * @param definition - Interval in ticks and callback to invoke.
   */
  export function register(triggerId: string, definition: MainTriggerDefinition): void;

  /** Main-thread trigger definition shape. */
  export interface MainTriggerDefinition {
    /** Interval between callbacks in simulation ticks. */
    interval: number;
    /** Called each time the trigger fires. */
    callback: () => void;
    [key: string]: unknown;
  }
}
