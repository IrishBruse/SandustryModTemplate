/**
 * Interval-based main-thread trigger registration.
 *
 * Available as `sandkit.api.triggers`.
 *
 * @module
 */
export namespace triggers {
  /** Register a repeating trigger with interval and callback. */
  export function register(triggerId: string, definition: MainTriggerDefinition): void;

  /** Main-thread trigger definition shape. */
  export interface MainTriggerDefinition {
    interval: number;
    callback: () => void;
    [key: string]: unknown;
  }
}
