/**
 * `sandkit.api.lights` — temporary VFX lights and persistent world lights.
 * Main thread only.
 */
export namespace lights {
  /** Short-lived visual effect lights. */
  export namespace vfx {
    /** Creates a temporary light at world coordinates. */
    export function createAtWorld(worldX: number, worldY: number, options?: TemporaryLightOptions): { index: number | null; };
    /** Removes a temporary light by its id. */
    export function removeById(lightId: number): void;
  }

  /** Lights that persist in the world save. */
  export namespace persistent {
    /** Creates a persistent light at world coordinates. */
    export function createAtWorld(worldX: number, worldY: number, options?: PersistentLightOptions): any;
    /** Removes the persistent light at world coordinates. */
    export function removeAtWorld(worldX: number, worldY: number): void;
    /** Fades out the persistent light at world coordinates over durationMs. */
    export function fadeAtWorld(worldX: number, worldY: number, durationMs?: number): void;
    /** Marks persistent lights dirty so they are saved on the next flush. */
    export function markDirty(): void;
  }

  /** Options for temporary VFX lights (not yet typed in declarations). */
  export type TemporaryLightOptions = unknown
  /** Options for persistent world lights (not yet typed in declarations). */
  export type PersistentLightOptions = unknown
}
