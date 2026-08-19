import type { Direction } from "./common";

/**
 * Built-in retro console for embedded games.
 *
 * Prefer `api.retroConsole.registerGame` over custom iframe overlays.
 * Vanilla structure: `retroConsole`. Vanilla item: `retroConsoleController`.
 */
export interface RetroConsoleContext {
  width: number;
  height: number;
  clearScreen(): void;
  drawPixel(x: number, y: number): void;
}

export type RetroConsoleInput = Direction;

export interface RetroConsoleGame {
  id: string;
  name: string;
  options?: { width?: number; height?: number };
  init(rc: RetroConsoleContext): unknown;
  update(rc: RetroConsoleContext, state: unknown): unknown;
  handleInput?(
    rc: RetroConsoleContext,
    state: unknown,
    dir: RetroConsoleInput,
  ): unknown;
}

export interface RetroConsoleApi {
  registerGame(definition: RetroConsoleGame): void;
}
