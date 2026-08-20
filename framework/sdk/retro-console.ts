import type { RetroConsoleGame } from "types/engine";

export type {
  RetroConsoleApi,
  RetroConsoleDisplay,
  RetroConsoleGame,
  RetroConsoleGameOptions,
  RetroConsoleInput,
  RetroConsolePixel,
} from "types/engine";

/**
 * Register a game on the in-world Retro Console.
 * Returns false when `sandkit.engine.api.retroConsole` is missing.
 */
export function registerRetroGame<TState>(game: RetroConsoleGame<TState>): boolean {
  const retro = sandkit.engine.api.retroConsole;
  if (typeof retro?.registerGame !== "function") {
    console.warn("retroConsole.registerGame is not ready");
    return false;
  }
  retro.registerGame(game);
  return true;
}
