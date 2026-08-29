import assert from "node:assert/strict";
import { test } from "node:test";
import { addCargo, cargoCount, takeCargo } from "./cargo.ts";
import { MAX_CARGO } from "../constants.ts";

test("adds until the cart is full", () => {
  const cargo: Record<string, number> = {};
  for (let i = 0; i < MAX_CARGO; i += 1) assert.equal(addCargo(cargo, 3), true);
  assert.equal(addCargo(cargo, 3), false);
  assert.equal(cargoCount(cargo), MAX_CARGO);
});

test("takeCargo returns the stored type", () => {
  const cargo: Record<string, number> = {};
  addCargo(cargo, 9, 2);
  assert.equal(takeCargo(cargo), 9);
  assert.equal(takeCargo(cargo), 9);
  assert.equal(takeCargo(cargo), null);
});
