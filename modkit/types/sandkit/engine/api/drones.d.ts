/**
 * `sandkit.engine.api.drones` — drone spawn and removal.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Methods use loose stubs; signatures may take game state as the first argument.
 *
 * @internal
 */
export namespace drones {
  /** Remove one or more drones. */
  export function kill(...args: unknown[]): unknown;
  /** Spawn a drone instance. */
  export function spawn(...args: unknown[]): unknown;
}
