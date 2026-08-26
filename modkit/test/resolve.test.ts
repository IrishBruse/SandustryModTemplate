import assert from "node:assert/strict";
import test from "node:test";
import { isSandustryAvailable, sandustryTest, toPageExpression } from "@modkit/test";

test("@modkit/test resolves under node --test", () => {
  assert.equal(typeof isSandustryAvailable, "function");
  assert.equal(typeof sandustryTest, "function");
  assert.equal(
    toPageExpression(() => 1),
    "(() => 1)()",
  );
});
