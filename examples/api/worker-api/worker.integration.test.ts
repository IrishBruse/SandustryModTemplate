import assert from "node:assert/strict";
import test from "node:test";
import { SANDUSTRY_TEST_HTTP_PORT, setupGame } from "@modkit/test";

const MOD_ID = "example.worker-api";
const WORKER_URL = `http://127.0.0.1:${SANDUSTRY_TEST_HTTP_PORT}/mods/${MOD_ID}/worker.js`;
const game = await setupGame();

test("worker-api serves worker.js", async (t) => {
  const ids = await game.orderedModIds();
  if (!ids.includes(MOD_ID)) {
    t.skip(`${MOD_ID} is not loaded`);
    return;
  }
  const response = await fetch(WORKER_URL, { signal: AbortSignal.timeout(5000) });
  assert.equal(response.ok, true);
});
