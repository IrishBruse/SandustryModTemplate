export namespace triggers {
  export function register(triggerId: string, definition: MainTriggerDefinition): void;

  export interface MainTriggerDefinition {
    interval: number;
    callback: () => void;
    [key: string]: unknown;
  }
}
