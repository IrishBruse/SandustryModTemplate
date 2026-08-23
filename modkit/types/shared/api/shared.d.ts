/**
 * Shared `sandkit.api.shared` base — cross-thread shared memory buffers.
 *
 * Main thread uses {@link shared.buffers.get} and `create`. Workers extend this
 * with `require` in worker `sandkit.api.shared`.
 *
 * @internal Base namespace reused by main and worker declarations.
 */
export namespace shared {
  /** Named shared memory buffers (`create` / `get` on main; `require` on workers). */
  export namespace buffers {
    /**
     * Look up a named shared buffer without creating it.
     * @param key - Buffer name shared across threads.
     * @returns The typed array, or `undefined` when the buffer does not exist.
     */
    export function get(key: string): SharedArray | undefined;
  }

  /**
   * Typed array backing a shared buffer.
   *
   * Use {@link SharedArrayType} when creating or requiring a buffer. The runtime
   * returns the matching `*Array` constructor for the configured type.
   */
  export type SharedArray =
    | Uint8Array
    | Uint16Array
    | Uint32Array
    | Int8Array
    | Int16Array
    | Int32Array
    | Float32Array
    | Float64Array;

  /** Discriminator for the underlying typed array kind. */
  export type SharedArrayType =
    | "uint8"
    | "uint16"
    | "uint32"
    | "int8"
    | "int16"
    | "int32"
    | "float32"
    | "float64";
}
