import type { Direction } from "./common";

/**
 * Internal engine API (`sandkit.engine.api`).
 *
 * Public mod APIs live on `sandkit.api`. Use this surface only when the
 * public API cannot do the job.
 */
export interface SandkitEngineApi {
  retroConsole?: RetroConsoleApi;
}

/** Retro Console games (`sandkit.engine.api.retroConsole`). */
export interface RetroConsoleApi {
  registerGame<TState>(game: RetroConsoleGame<TState>): void;
}

/**
 * Pixel value on the Retro Console display.
 *
 * - `true` uses `options.pixelOn`
 * - `false` uses `options.pixelOff`
 * - a number is an element type id
 */
export type RetroConsolePixel = boolean | number;

/** Arrow-key vector passed to `handleInput`. */
export type RetroConsoleInput = Direction;

export interface RetroConsoleDisplay {
  readonly width: number;
  readonly height: number;
  /** Draw one pixel. `pixel` defaults to `true`. */
  drawPixel(x: number, y: number, pixel?: RetroConsolePixel): void;
  /** Fill the display. `pixel` defaults to `false`. */
  clearScreen(pixel?: RetroConsolePixel): void;
}

export interface RetroConsoleGameOptions {
  /** Display width in pixels. Defaults to 18. */
  width?: number;
  /** Display height in pixels. Defaults to 14. */
  height?: number;
  /** Element type id for `true` pixels. */
  pixelOn?: number;
  /** Element type id for `false` pixels. */
  pixelOff?: number;
}

export interface RetroConsoleGame<TState = unknown> {
  id: string;
  name: string;
  options?: RetroConsoleGameOptions;
  init(display: RetroConsoleDisplay): TState;
  update(display: RetroConsoleDisplay, state: TState): TState;
  handleInput(
    display: RetroConsoleDisplay,
    state: TState,
    input: RetroConsoleInput,
  ): TState;
}
