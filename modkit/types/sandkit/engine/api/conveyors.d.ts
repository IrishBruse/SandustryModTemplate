/**
 * `sandkit.engine.api.conveyors` — conveyor type registration.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 *
 * @internal
 */
export namespace conveyors {
  /** Register a custom conveyor type. */
  export function registerType(...args: unknown[]): unknown;
}
