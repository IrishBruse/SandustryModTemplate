import assert from "node:assert/strict";
import { test } from "node:test";
import { isLoadableMatter, Matter } from "./matter.ts";

test("powders and liquids load; solids and gas do not", () => {
  assert.equal(isLoadableMatter(Matter.Powder), true);
  assert.equal(isLoadableMatter(Matter.Liquid), true);
  assert.equal(isLoadableMatter(Matter.Solid), false);
  assert.equal(isLoadableMatter(Matter.Gas), false);
  assert.equal(isLoadableMatter(null), false);
});
