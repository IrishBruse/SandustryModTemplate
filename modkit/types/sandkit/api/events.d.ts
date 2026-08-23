/**
 * `sandkit.api.events` — subscribe to and emit named game events.
 * Main thread only.
 */
export namespace events {
  /**
   * Subscribes to an event. Returns an unsubscribe function.
   * @param eventId - Registered event name.
   * @param callback - Called when the event is emitted.
   */
  export function on<K extends string>(eventId: K, callback: (payload: EventPayload<K>) => void): () => void;
  /**
   * Emits an event with a payload to all subscribers.
   * @param eventId - Registered event name.
   * @param payload - Serializable payload passed to listeners.
   */
  export function emit<K extends string>(eventId: K, payload: EventPayload<K>): void;

  /** Event payload type for a given event id (not yet typed in declarations). */
  export type EventPayload<K> = unknown
}
