/**
 * Cross-thread shared memory buffers.
 *
 * Available as `sandkit.api.shared`.
 *
 * @module
 */
import { shared } from "../../shared";

export namespace shared {
  /** Shared buffer create and lookup. */
  export namespace buffers {
    /**
     * Create a named shared buffer with type and length.
     * @param key - Buffer name shared across threads.
     * @param config - Typed array kind and element count.
     */
    export function create(key: string, config: { type: SharedArrayType; length: number; }): SharedArray;
    /** Look up a named shared buffer without creating it. */
    export import get = shared.api.shared.buffers.get
  }
  /** Opaque shared array backing store. */
  export import SharedArray = shared.api.shared.SharedArray
  /** Discriminator for the underlying typed array kind. */
  export import SharedArrayType = shared.api.shared.SharedArrayType
}
