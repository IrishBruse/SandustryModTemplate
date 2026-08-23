/**
 * Worker-thread `sandkit.api.main` — send events to the main thread.
 *
 * @internal Base shape reused by {@link WorkerSandkitApi}. Main thread has a
 * larger `sandkit.api` surface; do not assume parity.
 */
export namespace main {
  /**
   * Emit a custom event on the main thread.
   * @param eventId Registered event name.
   * @param payload Serializable payload passed to main-thread listeners.
   */
  export function emitEvent<Payload = any>(eventId: string, payload: Payload): void;
}
