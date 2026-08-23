import { shared as sharedShared } from "../../shared/api/shared";

/**
 * Worker-thread `sandkit.api.shared` — shared memory buffers for workers.
 *
 * Workers can **require** buffers (create or attach). Main thread only **gets**
 * existing buffers. See {@link shared} for the shared base declarations.
 *
 * @internal Worker extension of {@link shared}; not interchangeable with
 * main-thread `sandkit.api.shared`.
 */
export namespace shared {
  export namespace buffers {
    /**
     * Get or create a named shared buffer on this worker.
     * @param key Buffer name shared across threads.
     * @param config Array type and length when the buffer is first created.
     */
    export function require(key: string, config: { type: SharedArrayType; length: number; }): SharedArray;
    /** Read an existing buffer without creating one. */
    export import get = sharedShared.buffers.get
  }
  export import SharedArray = sharedShared.SharedArray
  export import SharedArrayType = sharedShared.SharedArrayType
}
