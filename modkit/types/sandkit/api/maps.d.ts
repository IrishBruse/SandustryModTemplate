import { maps as sharedMaps } from "../../shared/api/maps";

export namespace maps {
  // Shared
  export import getActive = sharedMaps.getActive
  export import ActiveMapV1 = sharedMaps.ActiveMapV1

  export function getAvailable(): readonly Readonly<AvailableMapV1>[];
  export function start(mapId: string): boolean;
  export type AvailableMapV1 = unknown
}