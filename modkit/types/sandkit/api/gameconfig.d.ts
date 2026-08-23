import { JsonObjectV1, JsonValueV1 } from "../../shared/jsonvalue";

/**
 * `sandkit.api.gameConfig` — read merged game configuration values.
 * Main thread only.
 */
export declare namespace gameConfig {
  /**
   * Returns a config value by key, or undefined when missing.
   * @param key - Game config key (merged defaults and overrides).
   */
  export function get(key: string): JsonValueV1 | undefined;
  /** Returns the full config object. */
  export function getAll(): JsonObjectV1;
}
