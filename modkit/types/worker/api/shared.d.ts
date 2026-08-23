import { shared } from "../../shared";

/**
 * Worker thread only.
 *
 * `sandkit.api.shared` — shared memory buffers for workers.
 *
 * Workers **require** buffers created on the main thread. Main thread only
 * **gets** existing buffers. See {@link shared} for the shared base declarations.
 *
 * @internal Worker extension of {@link shared}; not interchangeable with
 * main-thread `sandkit.api.shared`.
 */
export namespace shared {
  /** Named shared memory buffers for worker threads. */
  export namespace buffers {
    /**
     * Attach to a named shared buffer on this worker.
     *
     * The buffer must already exist on the main thread with the same
     * {@link SharedArrayType} and length as `config`.
     *
     * @param key - Buffer name shared across threads.
     * @param config - Expected array type and length for validation.
     */
    export function require(key: string, config: { type: SharedArrayType; length: number; }): SharedArray;
    /**
     * Read an existing buffer without validating type or length.
     * @param key - Buffer name shared across threads.
     */
    export import get = shared.api.shared.buffers.get
  }
  /** Typed array backing store for a shared buffer. */
  export import SharedArray = shared.api.shared.SharedArray
  /** Discriminator for the underlying typed array kind. */
  export import SharedArrayType = shared.api.shared.SharedArrayType
}
