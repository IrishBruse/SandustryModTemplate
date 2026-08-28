import assert from "node:assert/strict";
import test from "node:test";
import { SANDUSTRY_TEST_HTTP_PORT, setupGame } from "@modkit/test";

const MOD_ID = "example.mod-assets";
const INFO_URL = `http://127.0.0.1:${SANDUSTRY_TEST_HTTP_PORT}/mods/${MOD_ID}/info.json`;
const game = await setupGame();

test("mod-assets serves info.json", async (t) => {
  const ids = await game.orderedModIds();
  if (!ids.includes(MOD_ID)) {
    t.skip(`${MOD_ID} is not loaded`);
    return;
  }
  const response = await fetch(INFO_URL, { signal: AbortSignal.timeout(5000) });
  assert.equal(response.ok, true);
  const info = (await response.json()) as { message?: string };
  assert.equal(info.message, "Loaded from mod/info.json via assets.getUrl");
});
