import assert from "node:assert/strict";
import test from "node:test";
import { setupGame } from "@modkit/test";
import { setTimeout as sleep } from "node:timers/promises";

const TEMPLATE_ID = "author.template";
const INJECT_PROBE = "Template inject";
const HOTBAR_PROBE = "Template hotbar";
const GLOBAL_OVERLAY_ID = `${TEMPLATE_ID}:${TEMPLATE_ID}`;

type LiveSnapshot = {
  watch: boolean | null;
  scene: number | null;
  gameScene: number | null;
  generation: number;
  hasHost: boolean;
  injectText: string | null;
  hotbarText: string | null;
  globalIds: string[];
  localIds: string[];
};

type RendererGlobal = typeof globalThis & {
  sandkit?: {
    api?: {
      settings?: {
        get: (key: string) => unknown;
        getAll: () => Record<string, unknown>;
      };
    };
    enums?: { Scene?: { Game?: number } };
    engine?: {
      state?: {
        store?: { scene?: { active?: number } };
        session?: {
          ui?: { overlays?: { global?: Record<string, unknown> } };
          externalMods?: {
            orderedMods?: Array<{
              manifest?: { id?: string };
              workshop?: { discoveredVia?: string[] };
            }>;
          };
        };
      };
    };
  };
  __sandkitHotGenerations__?: Record<string, number>;
  __sandkitByMod?: Record<string, unknown>;
};

function readLive(modId: string): LiveSnapshot {
  const g = globalThis as RendererGlobal;
  const sandkit = g.sandkit;
  const state = sandkit && sandkit.engine && sandkit.engine.state;
  const overlays = state && state.session && state.session.ui && state.session.ui.overlays;
  const injectEl = document.querySelector('[data-hot-reload-probe="inject"]');
  const hotbarEl = document.querySelector('[data-hot-reload-probe="hotbar"]');
  const ordered =
    (state &&
      state.session &&
      state.session.externalMods &&
      state.session.externalMods.orderedMods) ||
    [];
  const localIds: string[] = [];
  for (const entry of ordered) {
    const id = entry && entry.manifest && entry.manifest.id;
    const via = entry && entry.workshop && entry.workshop.discoveredVia;
    if (typeof id === "string" && Array.isArray(via) && via.includes("local")) localIds.push(id);
  }
  const generations = g.__sandkitHotGenerations__ || {};
  const hosts = g.__sandkitByMod || {};
  const watchValue =
    sandkit && sandkit.api && sandkit.api.settings
      ? sandkit.api.settings.get("watchLocalMods")
      : null;
  const all =
    sandkit && sandkit.api && sandkit.api.settings && sandkit.api.settings.getAll
      ? sandkit.api.settings.getAll()
      : null;
  const watchFromAll =
    all && typeof all === "object" && typeof all.watchLocalMods === "boolean"
      ? all.watchLocalMods
      : null;
  return {
    watch: typeof watchValue === "boolean" ? watchValue : watchFromAll,
    scene: state && state.store && state.store.scene ? (state.store.scene.active ?? null) : null,
    gameScene:
      sandkit && sandkit.enums && sandkit.enums.Scene ? (sandkit.enums.Scene.Game ?? null) : null,
    generation: generations[modId] || 0,
    hasHost: !!(hosts && hosts[modId]),
    injectText: injectEl && injectEl.textContent ? injectEl.textContent.trim() : null,
    hotbarText: hotbarEl && hotbarEl.textContent ? hotbarEl.textContent.trim() : null,
    globalIds: overlays && overlays.global ? Object.keys(overlays.global) : [],
    localIds,
  };
}

const game = await setupGame();

test("live hot reload updates inject and hotbar probes", async (t) => {
  const live = await game.evaluate(readLive, TEMPLATE_ID);

  if (live.watch !== true) {
    t.skip("Watch local mods is off");
    return;
  }
  if (live.gameScene == null || live.scene !== live.gameScene) {
    t.skip("Sandustry is not in the Game scene");
    return;
  }
  if (!live.localIds.includes(TEMPLATE_ID)) {
    t.skip("author.template is not a local ordered mod");
    return;
  }
  if (!live.hasHost) {
    t.skip("missing __sandkitByMod[author.template]; restart after debugPatches");
    return;
  }
  if (game.tryReadModMain(TEMPLATE_ID) === null) {
    t.skip(`installed ${TEMPLATE_ID}/main.js is missing`);
    return;
  }

  const token = `t${Date.now().toString(36)}`;
  const injectNext = `${INJECT_PROBE} ${token}`;
  const hotbarNext = `${HOTBAR_PROBE} ${token}`;
  const generationBefore = live.generation;

  // First poller fetch is a baseline. Wait so that fetch records the original bundle.
  await sleep(2000);

  await game.withModMain(TEMPLATE_ID, async (file) => {
    if (!file.original.includes(INJECT_PROBE) || !file.original.includes(HOTBAR_PROBE)) {
      t.skip("installed template bundle has no probe strings; rebuild the template");
      return;
    }
    if (!file.original.includes("data-hot-reload-probe")) {
      t.skip("installed template bundle has no inject probe attribute; rebuild the template");
      return;
    }

    file.replaceAll(INJECT_PROBE, injectNext);
    file.replaceAll(HOTBAR_PROBE, hotbarNext);

    const latest = await game.waitFor(
      readLive,
      (snapshot) =>
        snapshot.generation > generationBefore &&
        snapshot.injectText === injectNext &&
        snapshot.hotbarText === hotbarNext &&
        snapshot.globalIds.includes(GLOBAL_OVERLAY_ID) &&
        !snapshot.globalIds.some((id) => id.startsWith("hot-reload:") && id.includes(TEMPLATE_ID)),
      {
        timeoutMs: 12000,
        args: [TEMPLATE_ID],
        message: "hot reload probes did not update",
      },
    );

    assert.ok(latest.generation > generationBefore);
    assert.equal(latest.injectText, injectNext);
    assert.equal(latest.hotbarText, hotbarNext);
    assert.ok(latest.globalIds.includes(GLOBAL_OVERLAY_ID), String(latest.globalIds));
  });
});
