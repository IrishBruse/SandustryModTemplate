/**
 * In-world Retro Console shapes used by `registerRetroGame`.
 */
export type RetroConsolePixel = boolean | number;

export interface RetroConsoleDisplay {
  width: number;
  height: number;
  clearScreen(value?: RetroConsolePixel): void;
  drawPixel(x: number, y: number, value: RetroConsolePixel): void;
}

export interface RetroConsoleInput {
  x: number;
  y: number;
}

export interface RetroConsoleGameOptions {
  width: number;
  height: number;
}

export interface RetroConsoleGame<TState = unknown> {
  id: string;
  name: string;
  options?: RetroConsoleGameOptions;
  init(display: RetroConsoleDisplay): TState;
  update(display: RetroConsoleDisplay, state: TState): TState;
  handleInput?(display: RetroConsoleDisplay, state: TState, input: RetroConsoleInput): TState;
}

export interface RetroConsoleApi {
  registerGame<TState>(game: RetroConsoleGame<TState>): void;
}
