/**
 * Shared `sandkit.api.shared` base — cross-thread shared memory buffers.
 *
 * Main thread uses {@link shared.buffers.get}. Workers extend this with
 * `require` in worker `sandkit.api.shared`.
 *
 * @internal Base namespace reused by main and worker declarations.
 */
export namespace shared {
  /** Named shared memory buffers (`create` / `get` on main; `require` on workers). */
  export namespace buffers {
    /** Look up a named shared buffer without creating it. */
    export function get(key: string): SharedArray | undefined;
  }

  /** Opaque shared array backing store (typed at runtime). */
  export type SharedArray = unknown
  /** Discriminator for the underlying typed array kind. */
  export type SharedArrayType = unknown
}
