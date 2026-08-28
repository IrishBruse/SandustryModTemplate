import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { setupGame } from "@modkit/test";

const game = await setupGame();

describe("player", { concurrency: false }, () => {
  test("getPositionAtWorld is finite", async () => {
    const pos = await game.evaluate(() => {
      const p = sandkit.api.player.getPositionAtWorld();
      return { x: p.x, y: p.y };
    });
    assert.equal(typeof pos.x, "number");
    assert.equal(typeof pos.y, "number");
    assert.ok(Number.isFinite(pos.x));
    assert.ok(Number.isFinite(pos.y));
  });

  test("setPositionAtWorld moves the player", async () => {
    const before = await game.evaluate(() => {
      const pos = sandkit.api.player.getPositionAtWorld();
      return { x: pos.x, y: pos.y };
    });
    const targetX = before.x + 32;
    await game.evaluate(
      (x: number, y: number) => {
        sandkit.api.player.setPositionAtWorld(x, y);
      },
      targetX,
      before.y,
    );
    const after = await game.waitFor(
      () => {
        const pos = sandkit.api.player.getPositionAtWorld();
        return { x: pos.x, y: pos.y };
      },
      (pos) => Math.abs(pos.x - targetX) < 1,
      { message: "player did not move", timeoutMs: 4000 },
    );
    assert.ok(Math.abs(after.x - targetX) < 1);
    assert.equal(typeof after.y, "number");
  });
});
