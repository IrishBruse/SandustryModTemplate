import type { shared } from "../../shared";

/**
 * `sandkit.api.lights` — temporary VFX lights and persistent world lights.
 * Main thread only.
 */
export namespace lights {
  /** Short-lived visual effect lights. */
  export namespace vfx {
    /**
     * Creates a temporary light at world coordinates.
     * @param worldX - World X coordinate in pixels.
     * @param worldY - World Y coordinate in pixels.
     * @param options - Brightness, duration, color, and dedup options.
     */
    export function createAtWorld(worldX: number, worldY: number, options?: TemporaryLightOptions): { index: number | null; };
    /**
     * Removes a temporary light by its id.
     * @param lightId - Light index returned from {@link createAtWorld}.
     */
    export function removeById(lightId: number): void;
  }

  /** Lights that persist in the world save. */
  export namespace persistent {
    /**
     * Creates a persistent light at world coordinates.
     * @param worldX - World X coordinate in pixels.
     * @param worldY - World Y coordinate in pixels.
     * @param options - Brightness, size, color, and persistence options.
     */
    export function createAtWorld(worldX: number, worldY: number, options?: PersistentLightOptions): PersistentLightHandle;
    /**
     * Removes the persistent light at world coordinates.
     * @param worldX - World X coordinate in pixels.
     * @param worldY - World Y coordinate in pixels.
     */
    export function removeAtWorld(worldX: number, worldY: number): void;
    /**
     * Fades out the persistent light at world coordinates over durationMs.
     * @param worldX - World X coordinate in pixels.
     * @param worldY - World Y coordinate in pixels.
     * @param durationMs - Fade duration in milliseconds.
     */
    export function fadeAtWorld(worldX: number, worldY: number, durationMs?: number): void;
    /** Marks persistent lights dirty so they are saved on the next flush. */
    export function markDirty(): void;
  }

  /** Options for temporary VFX lights. */
  export type TemporaryLightOptions = shared.api.effects.TemporaryLightOptions;

  /** Options for persistent world lights. */
  export interface PersistentLightOptions {
    /** Light brightness multiplier. */
    brightness?: number;
    /** Light radius in pixels. */
    size?: number;
    /** RGBA color components. */
    color?: [number, number, number, number];
    [key: string]: unknown;
  }

  /** Handle returned from {@link persistent.createAtWorld}. */
  export type PersistentLightHandle = unknown
}
