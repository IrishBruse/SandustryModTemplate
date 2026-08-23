export namespace lights {
  export namespace vfx {
    export function createAtWorld(worldX: number, worldY: number, options?: TemporaryLightOptions): { index: number | null; };
    export function removeById(lightId: number): void;
  }

  export namespace persistent {
    export function createAtWorld(worldX: number, worldY: number, options?: PersistentLightOptions): any;
    export function removeAtWorld(worldX: number, worldY: number): void;
    export function fadeAtWorld(worldX: number, worldY: number, durationMs?: number): void;
    export function markDirty(): void;
  }

  export type TemporaryLightOptions = unknown
  export type PersistentLightOptions = unknown
}