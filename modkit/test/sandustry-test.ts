import test from "node:test";
import type { TestContext } from "node:test";
import { isSandustryAvailable } from "./cdp.ts";
import { SandustrySession } from "./session.ts";

export type SandustryTestFn = (t: TestContext, game: SandustrySession) => Promise<void> | void;

/**
 * Node `test()` case that talks to a live Sandustry renderer on CDP `:9222`.
 * Skips when the game is not listening.
 */
export function sandustryTest(name: string, fn: SandustryTestFn): void {
  test(name, async (t) => {
    if (!(await isSandustryAvailable())) {
      t.skip("Sandustry CDP :9222 is down");
      return;
    }

    let game: SandustrySession;
    try {
      game = await SandustrySession.connect();
    } catch (error) {
      t.skip(error instanceof Error ? error.message : String(error));
      return;
    }

    try {
      await fn(t, game);
    } finally {
      game.close();
    }
  });
}
