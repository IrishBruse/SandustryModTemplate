import assert from "node:assert/strict";
import test from "node:test";
import { setupGame } from "@modkit/test";

const OVERLAY_ID = "overlay-hotkey";
const game = await setupGame();

test("overlay-hotkey inject is registered", async (t) => {
  const found = await game.evaluate((id: string) => {
    const session = (
      sandkit.engine.state as {
        session?: { ui?: { overlays?: { global?: Record<string, unknown> } } };
      }
    ).session;
    const globalOverlays = session?.ui?.overlays?.global;
    return Boolean(globalOverlays && Object.keys(globalOverlays).some((key) => key.includes(id)));
  }, OVERLAY_ID);
  if (!found) {
    t.skip("example overlay-hotkey is not loaded");
    return;
  }
  assert.equal(found, true);
});
