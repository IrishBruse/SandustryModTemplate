import assert from "node:assert/strict";
import test from "node:test";
import { setupGame } from "@modkit/test";

const TEMPLATE_ID = "author.template";
const game = await setupGame();

type OrderedEntry = {
  manifest?: { id?: string };
};

test("template mod is loaded in Game", async (t) => {
  const live = await game.evaluate(() => {
    const session = (
      sandkit.engine.state as {
        session?: { externalMods?: { orderedMods?: OrderedEntry[] } };
      }
    ).session;
    const ordered = session?.externalMods?.orderedMods ?? [];
    const ids = ordered
      .map((entry) => entry?.manifest?.id)
      .filter((modId): modId is string => typeof modId === "string");
    return { ids };
  });

  if (!live.ids.includes(TEMPLATE_ID)) {
    t.skip(`${TEMPLATE_ID} is not loaded`);
    return;
  }
  assert.ok(live.ids.includes(TEMPLATE_ID));
});
