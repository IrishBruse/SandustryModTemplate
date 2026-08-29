import assert from "node:assert/strict";
import { test } from "node:test";
import { LOAD_DROP_MS } from "../constants.ts";
import { getLoadDrops, loadDropPos, resetLoadDrops, spawnLoadDrop } from "./loadDrops.ts";

test("load drop starts at hopper and lands near the cart", () => {
  resetLoadDrops();
  spawnLoadDrop(10, 20, 12, 24, 1000, () => 0.5);
  const drops = getLoadDrops();
  assert.equal(drops.length, 1);
  const pos0 = loadDropPos(drops[0], 1000);
  assert.ok(pos0.x >= 10 && pos0.x <= 14);
  assert.ok(Math.abs(pos0.y - 23.8) < 0.001);
  const pos1 = loadDropPos(drops[0], 1000 + LOAD_DROP_MS);
  assert.ok(Math.abs(pos1.x - drops[0].toX) < 0.001);
  assert.ok(Math.abs(pos1.y - drops[0].toY) < 0.001);
});

test("spawnLoadDrop randomizes x across the hopper span", () => {
  resetLoadDrops();
  const xs: number[] = [];
  for (let i = 0; i < 20; i += 1) {
    spawnLoadDrop(0, 0, 0, 4, 0, () => i / 20);
    xs.push(getLoadDrops()[getLoadDrops().length - 1].fromX);
  }
  assert.ok(new Set(xs.map((x) => Math.floor(x))).size > 1);
});
