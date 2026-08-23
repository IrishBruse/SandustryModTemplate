/**
 * In-world Retro Console shapes used by `sandkit.engine.api.retroConsole`.
 *
 * @internal
 *
 * Part of {@link SandkitEngine | the internal engine surface}. Register games
 * through {@link RetroConsoleApi.registerGame}.
 */

/** @internal */
export type RetroConsolePixel = boolean | number;

/** @internal */
export interface RetroConsoleDisplay {
  width: number;
  height: number;
  clearScreen(value?: RetroConsolePixel): void;
  drawPixel(x: number, y: number, value: RetroConsolePixel): void;
}

/** @internal */
export interface RetroConsoleInput {
  x: number;
  y: number;
}

/** @internal */
export interface RetroConsoleGameOptions {
  width: number;
  height: number;
}

/** @internal */
export interface RetroConsoleGame<TState = unknown> {
  id: string;
  name: string;
  options?: RetroConsoleGameOptions;
  init(display: RetroConsoleDisplay): TState;
  update(display: RetroConsoleDisplay, state: TState): TState;
  handleInput?(display: RetroConsoleDisplay, state: TState, input: RetroConsoleInput): TState;
}

/** @internal */
export interface RetroConsoleApi {
  registerGame<TState>(game: RetroConsoleGame<TState>): void;
}
