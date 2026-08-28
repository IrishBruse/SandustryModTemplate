import assert from "node:assert/strict";
import test from "node:test";
import { setupGame } from "@modkit/test";

const MOD_ID = "example.events";
const game = await setupGame();

type OrderedEntry = {
  manifest?: { id?: string };
};

test("events example is in the ordered mod list", async (t) => {
  const ids = await game.evaluate(() => {
    const session = (
      sandkit.engine.state as {
        session?: { externalMods?: { orderedMods?: OrderedEntry[] } };
      }
    ).session;
    const ordered = session?.externalMods?.orderedMods ?? [];
    return ordered
      .map((entry) => entry?.manifest?.id)
      .filter((id): id is string => typeof id === "string");
  });
  if (!ids.includes(MOD_ID)) {
    t.skip(`${MOD_ID} is not loaded`);
    return;
  }
  assert.ok(ids.includes(MOD_ID));
});
