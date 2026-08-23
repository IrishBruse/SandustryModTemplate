/**
 * Map selection and session start.
 *
 * Available as `sandkit.api.maps`.
 *
 * @module
 */
import { maps as sharedMaps } from "../../shared/api/maps";

export namespace maps {
  // Shared
  /** Return the active map for this session. */
  export import getActive = sharedMaps.getActive
  /** Active map data shape. */
  export import ActiveMapV1 = sharedMaps.ActiveMapV1

  /** Return maps the player can start. */
  export function getAvailable(): readonly Readonly<AvailableMapV1>[];
  /** Start a map by id. Return true when start succeeds. */
  export function start(mapId: string): boolean;
  /** Available map entry shape. */
  export type AvailableMapV1 = unknown
}
