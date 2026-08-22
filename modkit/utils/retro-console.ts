import type { RetroConsoleGame } from "../types/src/shared/engine";

export type {
  RetroConsoleApi,
  RetroConsoleDisplay,
  RetroConsoleGame,
  RetroConsoleGameOptions,
  RetroConsoleInput,
  RetroConsolePixel,
} from "../types/src/shared/engine";

/**
 * Register a game on the in-world Retro Console.
 * Returns false when `sandkit.engine.api.retroConsole` is missing.
 */
export function registerRetroGame<TState>(game: RetroConsoleGame<TState>): boolean {
  const retroConsole = sandkit.engine.api.retroConsole;
  if (typeof retroConsole?.registerGame !== "function") {
    console.warn("retroConsole.registerGame is not ready");
    return false;
  }
  retroConsole.registerGame(game);
  return true;
}
