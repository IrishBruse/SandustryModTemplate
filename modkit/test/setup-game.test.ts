import assert from "node:assert/strict";
import test from "node:test";
import { setupGame } from "./index.ts";

test("setupGame is exported for integration tests", () => {
  assert.equal(typeof setupGame, "function");
});
