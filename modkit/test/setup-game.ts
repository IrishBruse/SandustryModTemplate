import { isSandustryAvailable } from "./cdp.ts";
import { SandustrySession } from "./session.ts";

let shared: Promise<SandustrySession> | undefined;

/**
 * Connect to the Chromium integration host. One session is reused for every
 * later call in this Node process so several tests can share one Game.
 *
 * Live files run under `npm run test:integration` with concurrency 1.
 */
export async function setupGame(): Promise<SandustrySession> {
  if (process.env.SANDUSTRY_TEST_HOST !== "1") {
    throw new Error("setupGame() needs the integration host. Run npm run test:integration.");
  }
  if (!(await isSandustryAvailable())) {
    throw new Error(
      `setupGame() needs Chrome CDP on ${process.env.SANDUSTRY_CDP_URL ?? "http://127.0.0.1:9224"}.`,
    );
  }

  shared ??= SandustrySession.connectReady();
  return shared;
}
