import test from "node:test";
import type { TestContext } from "node:test";
import { startSandustryTestHost } from "./host.ts";
import { SandustrySession } from "./session.ts";

export type SandustryTestFn = (t: TestContext, game: SandustrySession) => Promise<void> | void;

/**
 * Node `test()` case that talks to the isolated Sandustry test host (CDP `:9223`).
 * Skips when the binary, Xvfb, test mods, or Game scene are missing.
 */
export function sandustryTest(name: string, fn: SandustryTestFn): void {
  test(name, async (t) => {
    const host = await startSandustryTestHost();
    if (!host.ok) {
      t.skip(host.reason);
      return;
    }

    let game: SandustrySession;
    try {
      game = await SandustrySession.connectReady();
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
