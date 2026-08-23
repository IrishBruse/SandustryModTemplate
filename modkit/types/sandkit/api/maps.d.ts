/**
 * Map selection and session start.
 *
 * Available as `sandkit.api.maps`.
 *
 * @module
 */
import { shared } from "../../shared";

export namespace maps {
  // Shared
  /** Return the active map for this session. */
  export import getActive = shared.api.maps.getActive
  /** Active map data shape. */
  export import ActiveMapV1 = shared.api.maps.ActiveMapV1

  /** Return maps the player can start. */
  export function getAvailable(): readonly Readonly<AvailableMapV1>[];
  /**
   * Start a map by id. Return true when start succeeds.
   * @param mapId - Custom map identifier.
   */
  export function start(mapId: string): boolean;

  /** Available map entry shape. */
  export interface AvailableMapV1 {
    /** Map identifier passed to {@link start}. */
    id: string;
    /** Display name or translation key. */
    name?: string;
    [key: string]: unknown;
  }
}
