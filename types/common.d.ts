/**
 * Shared primitives for Sandustry modding types.
 *
 * Mod settings from `configSchema` are read via `api.settings.get(...)`.
 * Read-only game config uses `api.gameConfig`.
 */

export interface CellPos {
  x: number;
  y: number;
}

export interface CellRect extends CellPos {
  width: number;
  height: number;
}

export interface Direction {
  x: number;
  y: number;
}

/** Loose record for mod-defined payloads. */
export type DataBag = Record<string, unknown>;
