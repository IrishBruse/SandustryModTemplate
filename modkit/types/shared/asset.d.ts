/**
 * Shared asset reference shape.
 *
 * @internal Base type reused by domain shapes such as {@link Player}. Not a
 * runtime `sandkit` namespace.
 */

/** Reference to a loaded sprite or texture asset. */
export interface AssetRef {
  /** Runtime asset id. */
  id: number
  /** Asset category discriminator used by the renderer. */
  type: number
}
