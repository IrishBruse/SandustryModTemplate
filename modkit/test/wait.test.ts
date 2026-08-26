import assert from "node:assert/strict";
import test from "node:test";
import { waitFor } from "./wait.ts";

test("waitFor returns when match is true", async () => {
  let n = 0;
  const value = await waitFor(
    async () => {
      n += 1;
      return n;
    },
    (latest) => latest >= 3,
    { timeoutMs: 500, intervalMs: 1 },
  );
  assert.equal(value, 3);
});

test("waitFor throws with the last value after timeout", async () => {
  await assert.rejects(
    () =>
      waitFor(
        async () => 1,
        (n) => n === 2,
        { timeoutMs: 40, intervalMs: 10, message: "never two" },
      ),
    /never two: last value 1/,
  );
});
