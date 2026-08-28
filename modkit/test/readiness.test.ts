import assert from "node:assert/strict";
import test from "node:test";
import {
  formatRendererReadySnapshot,
  isRendererReady,
  type RendererReadySnapshot,
} from "./readiness.ts";

function snap(partial: Partial<RendererReadySnapshot>): RendererReadySnapshot {
  return {
    api: false,
    scene: null,
    game: null,
    gameReady: false,
    loading: true,
    ...partial,
  };
}

test("isRendererReady needs Game scene, gameReady, and no loading overlay", () => {
  const game = 3;
  assert.equal(isRendererReady(snap({ api: true, scene: game, game: game })), false);
  assert.equal(
    isRendererReady(snap({ api: true, scene: game, game: game, gameReady: true })),
    false,
  );
  assert.equal(
    isRendererReady(snap({ api: true, scene: game, game: game, gameReady: true, loading: false })),
    true,
  );
  assert.equal(
    isRendererReady(snap({ api: true, scene: 1, game: game, gameReady: true, loading: false })),
    false,
  );
});

test("formatRendererReadySnapshot is JSON", () => {
  assert.equal(
    formatRendererReadySnapshot(snap({ api: true, scene: 3, game: 3, gameReady: true, loading: false })),
    '{"api":true,"scene":3,"game":3,"gameReady":true,"loading":false}',
  );
});
