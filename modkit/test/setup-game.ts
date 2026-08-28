import { after } from "node:test";
import { isSandustryAvailable } from "./cdp.ts";
import { SandustrySession } from "./session.ts";

let shared: Promise<SandustrySession> | undefined;
let closeHooked = false;

function closeShared(): void {
  const pending = shared;
  shared = undefined;
  void pending
    ?.then((session) => {
      session.close();
    })
    .catch(() => undefined);
}

/**
 * Connect to the Chromium integration host. One session is reused for every
 * later call in this Node process so several tests in a file can share one Game.
 *
 * The CDP socket is closed when the current test file finishes. Node `--test`
 * runs each file in its own process; an open socket would keep that process
 * alive after the last test.
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

  if (!closeHooked) {
    closeHooked = true;
    after(closeShared);
  }

  shared ??= SandustrySession.connectReady();
  return shared;
}
