/**
 * Cross-thread shared memory buffers.
 *
 * Available as `sandkit.api.shared`.
 *
 * @module
 */
import { shared as sharedShared } from "../../shared/api/shared";

export namespace shared {
  /** Shared buffer create and lookup. */
  export namespace buffers {
    /** Create a named shared buffer with type and length. */
    export function create(key: string, config: { type: SharedArrayType; length: number; }): SharedArray;
    /** Look up a named shared buffer without creating it. */
    export import get = sharedShared.buffers.get
  }
  /** Opaque shared array backing store. */
  export import SharedArray = sharedShared.SharedArray
  /** Discriminator for the underlying typed array kind. */
  export import SharedArrayType = sharedShared.SharedArrayType
}
