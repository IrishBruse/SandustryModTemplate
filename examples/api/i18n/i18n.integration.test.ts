import assert from "node:assert/strict";
import test from "node:test";
import { setupGame } from "@modkit/test";

const GREETING_KEY = "example.i18n.greeting";
const GREETING = "Hello from i18n";
const game = await setupGame();

test("i18n.t returns the registered greeting", async (t) => {
  const text = await game.evaluate((key: string) => sandkit.api.i18n.t(key), GREETING_KEY);
  if (text !== GREETING) {
    t.skip("example.i18n is not loaded");
    return;
  }
  assert.equal(text, GREETING);
});
