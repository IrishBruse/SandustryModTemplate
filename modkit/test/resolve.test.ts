import assert from "node:assert/strict";
import test from "node:test";
import { expect, isSandustryAvailable, SandustrySession, setupGame, toPageExpression } from "@modkit/test";

test("@modkit/test resolves under node --test", () => {
  assert.equal(typeof isSandustryAvailable, "function");
  assert.equal(typeof setupGame, "function");
  assert.equal(typeof expect, "function");
  assert.equal(typeof SandustrySession.prototype.orderedModIds, "function");
  assert.equal(
    toPageExpression(() => 1),
    "(() => 1)()",
  );
});
