import assert from "node:assert/strict";
import { test } from "node:test";
import { fallDamageForDrop, resetFallDamage, tickFallDamage } from "./fallDamage.ts";

const CELL = 4;
/** Survival jump height is about 96 px (24 cells) at 1.75× gravity. */
const JUMP_DROP_PX = 96;

test("jump landings deal no fall damage", () => {
  assert.equal(fallDamageForDrop(JUMP_DROP_PX, CELL), 0);
  assert.equal(fallDamageForDrop(28 * CELL, CELL), 0);
});

test("drops past 28 cells deal 2 damage per extra cell", () => {
  assert.equal(fallDamageForDrop(29 * CELL, CELL), 2);
  assert.equal(fallDamageForDrop(40 * CELL, CELL), 24);
  assert.equal(fallDamageForDrop(78 * CELL, CELL), 100);
});

test("invalid drop or cell size deals no damage", () => {
  assert.equal(fallDamageForDrop(0, CELL), 0);
  assert.equal(fallDamageForDrop(-40, CELL), 0);
  assert.equal(fallDamageForDrop(200, 0), 0);
});

test("tickFallDamage damages once on a long landing", () => {
  resetFallDamage();
  assert.equal(tickFallDamage({ y: 0, onGround: false, cellSize: CELL }), 0);
  assert.equal(tickFallDamage({ y: 40 * CELL, onGround: true, cellSize: CELL }), 24);
  assert.equal(tickFallDamage({ y: 40 * CELL, onGround: true, cellSize: CELL }), 0);
});

test("tickFallDamage ignores teleports and hover", () => {
  resetFallDamage();
  tickFallDamage({ y: 0, onGround: false, cellSize: CELL });
  assert.equal(tickFallDamage({ dt: 0, y: 80 * CELL, onGround: true, cellSize: CELL }), 0);
  tickFallDamage({ y: 0, onGround: false, cellSize: CELL });
  assert.equal(
    tickFallDamage({
      y: 80 * CELL,
      onGround: true,
      isHovering: true,
      cellSize: CELL,
    }),
    0,
  );
});
