/**
 * `sandkit.engine.api.retroConsole` — in-world Retro Console game types.
 *
 * **Internal API.** Prefer {@link sandkit.api} when a public method exists.
 * Register games through {@link RetroConsoleApi.registerGame}.
 *
 * @internal
 */

/** Pixel value for the Retro Console framebuffer. @internal */
export type RetroConsolePixel = boolean | number;

/** Low-resolution display buffer for a Retro Console game. @internal */
export interface RetroConsoleDisplay {
  width: number;
  height: number;
  /** Clear the framebuffer. Optional fill value defaults to off. */
  clearScreen(value?: RetroConsolePixel): void;
  /** Set one pixel in the framebuffer. */
  drawPixel(x: number, y: number, value: RetroConsolePixel): void;
}

/** Directional input from the Retro Console controls. @internal */
export interface RetroConsoleInput {
  x: number;
  y: number;
}

/** Display size options for a registered Retro Console game. @internal */
export interface RetroConsoleGameOptions {
  width: number;
  height: number;
}

/** Retro Console game definition passed to {@link RetroConsoleApi.registerGame}. @internal */
export interface RetroConsoleGame<TState = unknown> {
  id: string;
  name: string;
  options?: RetroConsoleGameOptions;
  /** Create initial game state and draw the first frame. */
  init(display: RetroConsoleDisplay): TState;
  /** Advance one frame and return updated game state. */
  update(display: RetroConsoleDisplay, state: TState): TState;
  /** Handle player input when provided. */
  handleInput?(display: RetroConsoleDisplay, state: TState, input: RetroConsoleInput): TState;
}

/** `sandkit.engine.api.retroConsole` registration API. @internal */
export interface RetroConsoleApi {
  /** Register a Retro Console mini-game. */
  registerGame<TState>(game: RetroConsoleGame<TState>): void;
}
