import assert from "node:assert/strict";
import test from "node:test";
import { setupGame } from "@modkit/test";
import { setTimeout as sleep } from "node:timers/promises";

const COMPANION_ID = "dev-tools";
const TEMPLATE_ID = "author.template";
const TOAST_PROBE = "Template loaded";
const HOT_PROBE_KEY = "__devToolsHotProbe";

type SandkitHost = {
  api?: {
    settings?: {
      get?: (key: string) => unknown;
      getAll?: () => Record<string, unknown>;
    };
  };
};

type LiveSnapshot = {
  watch: boolean | null;
  companionEnabled: boolean | null;
  scene: number | null;
  gameScene: number | null;
  generation: number;
  companionGeneration: number;
  hasHost: boolean;
  hasCompanionHost: boolean;
  hotProbe: string | null;
  localIds: string[];
  orderedIds: string[];
};

type RendererGlobal = typeof globalThis & {
  sandkit?: {
    enums?: { Scene?: { Game?: number } };
    engine?: {
      state?: {
        store?: { scene?: { active?: number } };
        session?: {
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
  __sandkitByMod?: Record<string, SandkitHost>;
  __devToolsHotProbe?: unknown;
};

function readLive(modId: string): LiveSnapshot {
  const g = globalThis as RendererGlobal;
  const sandkit = g.sandkit;
  const state = sandkit?.engine?.state;
  const ordered = state?.session?.externalMods?.orderedMods ?? [];
  const localIds: string[] = [];
  const orderedIds: string[] = [];
  for (const entry of ordered) {
    const id = entry?.manifest?.id;
    if (typeof id === "string") orderedIds.push(id);
    const via = entry?.workshop?.discoveredVia;
    if (typeof id === "string" && Array.isArray(via) && via.includes("local")) localIds.push(id);
  }
  const generations = g.__sandkitHotGenerations__ ?? {};
  const hosts = g.__sandkitByMod ?? {};
  const companion = hosts["dev-tools"];
  const companionGet =
    companion &&
    companion.api &&
    companion.api.settings &&
    typeof companion.api.settings.get === "function"
      ? companion.api.settings.get.bind(companion.api.settings)
      : null;
  const readCompanionBool = (key: string): boolean | null => {
    if (!companionGet) return null;
    const value = companionGet(key);
    return typeof value === "boolean" ? value : null;
  };
  const testHost = (g as typeof g & { __sandustryTestHost?: boolean }).__sandustryTestHost === true;
  const watchValue = readCompanionBool("watchLocalMods");
  const hotProbe = g.__devToolsHotProbe;
  return {
    watch: watchValue === true || testHost,
    companionEnabled: readCompanionBool("enabled"),
    scene: state?.store?.scene?.active ?? null,
    gameScene: sandkit?.enums?.Scene?.Game ?? null,
    generation: generations[modId] ?? 0,
    companionGeneration: generations["dev-tools"] ?? 0,
    hasHost: Boolean(hosts[modId]),
    hasCompanionHost: Boolean(hosts["dev-tools"]),
    hotProbe: typeof hotProbe === "string" ? hotProbe : null,
    localIds,
    orderedIds,
  };
}

type SkipReason = string | null;

function skipReason(live: LiveSnapshot): SkipReason {
  if (live.companionEnabled === false) return `${COMPANION_ID} is disabled`;
  if (live.watch !== true) return "Watch local mods is off on the dev-tools companion";
  if (live.gameScene == null || live.scene !== live.gameScene)
    return "Sandustry is not in the Game scene";
  if (!live.orderedIds.includes(COMPANION_ID)) return `${COMPANION_ID} is not loaded`;
  if (!live.localIds.includes(TEMPLATE_ID)) return `${TEMPLATE_ID} is not a local ordered mod`;
  if (!live.hasCompanionHost) {
    return `missing __sandkitByMod[${COMPANION_ID}]; restart after debugPatches`;
  }
  if (!live.hasHost) {
    return `missing __sandkitByMod[${TEMPLATE_ID}]; restart after debugPatches`;
  }
  return null;
}

function appendHotProbe(original: string, token: string): string {
  return `${original}\n;globalThis.${HOT_PROBE_KEY}=${JSON.stringify(token)};\n`;
}

const game = await setupGame();

test("dev-tools preflight: companion watch is on and template is local", async (t) => {
  const live = await game.evaluate(readLive, TEMPLATE_ID);
  const reason = skipReason(live);
  if (reason) {
    t.skip(reason);
    return;
  }
  const main = game.tryReadModMain(TEMPLATE_ID);
  if (main === null) {
    t.skip(`installed ${TEMPLATE_ID}/main.js is missing`);
    return;
  }

  assert.equal(live.watch, true);
  assert.ok(live.orderedIds.includes(COMPANION_ID));
  assert.ok(live.localIds.includes(TEMPLATE_ID));
  assert.ok(main.includes(TOAST_PROBE));
});

test("live hot reload evals new template source", async (t) => {
  const live = await game.evaluate(readLive, TEMPLATE_ID);
  const reason = skipReason(live);
  if (reason) {
    t.skip(reason);
    return;
  }
  if (game.tryReadModMain(TEMPLATE_ID) === null) {
    t.skip(`installed ${TEMPLATE_ID}/main.js is missing`);
    return;
  }

  const token = `t${Date.now().toString(36)}`;
  const generationBefore = live.generation;

  // First poller fetch is a baseline. Wait so that fetch records the original bundle.
  await sleep(2000);

  await game.withModMain(TEMPLATE_ID, async (file) => {
    if (!file.original.includes(TOAST_PROBE)) {
      t.skip("installed template bundle has no load toast; rebuild the template");
      return;
    }

    file.write(appendHotProbe(file.original, token));

    const latest = await game.waitFor(
      readLive,
      (snapshot) => snapshot.generation > generationBefore && snapshot.hotProbe === token,
      {
        timeoutMs: 12000,
        args: [TEMPLATE_ID],
        message: "hot reload did not eval the new template source",
      },
    );

    assert.ok(latest.generation > generationBefore);
    assert.equal(latest.hotProbe, token);
  });
});

test("hot reload increments the generation counter", async (t) => {
  const live = await game.evaluate(readLive, TEMPLATE_ID);
  const reason = skipReason(live);
  if (reason) {
    t.skip(reason);
    return;
  }
  if (game.tryReadModMain(TEMPLATE_ID) === null) {
    t.skip(`installed ${TEMPLATE_ID}/main.js is missing`);
    return;
  }

  const token = `g${Date.now().toString(36)}`;
  const generationBefore = live.generation;
  await sleep(2000);

  await game.withModMain(TEMPLATE_ID, async (file) => {
    if (!file.original.includes(TOAST_PROBE)) {
      t.skip("installed template bundle has no load toast; rebuild the template");
      return;
    }

    file.write(`${file.original}\n/* ${token} */\n`);

    const latest = await game.waitFor(
      readLive,
      (snapshot) => snapshot.generation > generationBefore,
      {
        timeoutMs: 12000,
        args: [TEMPLATE_ID],
        message: "hot reload generation did not increment",
      },
    );

    assert.ok(latest.generation > generationBefore);
  });
});

test("hot reload does not poll the companion mod main.js", async (t) => {
  const live = await game.evaluate(readLive, TEMPLATE_ID);
  const reason = skipReason(live);
  if (reason) {
    t.skip(reason);
    return;
  }
  if (game.tryReadModMain(COMPANION_ID) === null) {
    t.skip(`installed ${COMPANION_ID}/main.js is missing`);
    return;
  }

  const token = `c${Date.now().toString(36)}`;
  const templateGenerationBefore = live.generation;
  const companionGenerationBefore = live.companionGeneration;
  await sleep(2000);

  await game.withModMain(COMPANION_ID, async (file) => {
    const marker = `/* integration-dev-tools-self-poll ${token} */`;
    if (file.original.includes(marker)) {
      t.skip("companion bundle already contains the integration marker");
      return;
    }

    file.write(`${marker}\n${file.original}`);

    await sleep(3000);

    const latest = await game.evaluate(readLive, TEMPLATE_ID);
    assert.equal(latest.companionGeneration, companionGenerationBefore);
    assert.equal(latest.generation, templateGenerationBefore);
  });
});
