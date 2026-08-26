import type { LooseString } from "../../shared/nominal";

/**
 * `sandkit.api.events` — subscribe to and emit named game events.
 * Main thread only. The `events` object is frozen; do not replace `on` or `emit`.
 */
export namespace events {
  /**
   * Subscribes to an event. Returns an unsubscribe function.
   * @param eventId - Registered event name.
   * @param callback - Called when the event is emitted.
   */
  export function on<K extends EventId>(eventId: K, callback: (payload: EventPayload<K>) => void): () => void;
  /**
   * Emits an event with a payload to all subscribers.
   * @param eventId - Registered event name.
   * @param payload - Serializable payload passed to listeners.
   */
  export function emit<K extends EventId>(eventId: K, payload: EventPayload<K>): void;

  /**
   * Mutable payload for `player:collision:prepare`.
   * Listeners may change `maxStepCells` (clamped 1–8) and phasing flags.
   */
  export interface PlayerCollisionPreparePayload {
    /** When true, terrain collision is skipped this sub-step. */
    phaseThroughTerrain: boolean;
    /** When true, structure collision is skipped this sub-step. */
    phaseThroughStructures: boolean;
    /** Max cells the player can step up when blocked horizontally (1–8). */
    maxStepCells: number;
  }

  /** Known event payloads. Unlisted ids still use `unknown`. */
  export interface EventPayloadMap {
    "player:collision:prepare": PlayerCollisionPreparePayload;
    "player:moved": {
      /**
       * Simulation step duration in seconds.
       * `0` on teleports. The event runs after collision; landing already
       * zeroes `velocity.y`. Vanilla gravity is applied after this event.
       */
      dt?: number;
      state?: unknown;
    };
  }

  /** Known event names plus any custom string id. */
  export type EventId = LooseString<keyof EventPayloadMap>;

  /** Event payload type for a given event id. */
  export type EventPayload<K> = K extends keyof EventPayloadMap ? EventPayloadMap[K] : unknown;
}
