export namespace events {
  export function on<K extends string>(eventId: K, callback: (payload: EventPayload<K>) => void): () => void;
  export function emit<K extends string>(eventId: K, payload: EventPayload<K>): void;

  export type EventPayload<K> = unknown
}
