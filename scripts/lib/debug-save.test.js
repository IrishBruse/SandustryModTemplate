import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  debugSaveIdentity,
  ensureAllModDebugSaves,
  ensureModDebugSaves,
  ensureNamedVoidSave,
  latestSteamSaveForWorld,
  listSteamSavesForWorld,
  parseSaveFile,
  sanitizeSaveId,
  writeSteamLastPlayed,
} from "./debug-save.js";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const TMP = join(ROOT, ".tmp", "debug-save-unit");

test("sanitizeSaveId keeps dots and replaces spaces", () => {
  assert.equal(sanitizeSaveId("irishbruse.dev-tools"), "irishbruse.dev-tools");
  assert.equal(sanitizeSaveId("a b"), "a_b");
});

test("debugSaveIdentity uses sanitized gameId for id and name", () => {
  assert.deepEqual(debugSaveIdentity({ gameId: "irishbruse.trees" }), {
    id: "irishbruse.trees",
    name: "irishbruse.trees",
  });
  assert.deepEqual(debugSaveIdentity({ gameId: "unit.id", name: "Named" }), {
    id: "unit.id",
    name: "unit.id",
  });
});

test("ensureNamedVoidSave writes id and name once", () => {
  const dest = join(TMP, "saves-named");
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dest, { recursive: true });
  const first = ensureNamedVoidSave(dest, "author.template");
  assert.equal(first.created, true);
  assert.equal(first.id, "author.template");
  const parsed = parseSaveFile(first.filePath);
  assert.equal(parsed.meta.id, "author.template");
  assert.equal(parsed.meta.name, "author.template");
  assert.equal(parsed.meta.worldName, "author.template");
  assert.equal(parsed.meta.worldId, "author.template");
  assert.equal(parsed.data.store.meta.worldName, "author.template");
  assert.equal(parsed.data.store.meta.worldId, "author.template");
  assert.equal(parsed.data.store.world.size.width, 1024);
  assert.equal(parsed.data.store.world.size.height, 1024);
  assert.equal(parsed.data.store.world.horizon.length, 1024);
  assert.equal(parsed.data.shadow.width, 1024);
  assert.equal(parsed.data.authorization.width, 1024);
  const matrix = parsed.data.matrix;
  assert.ok(Array.isArray(matrix));
  let cells = 0;
  for (let i = 1; i < matrix.length; i += 2) cells += matrix[i];
  assert.equal(cells, 1024 * 1024);
  assert.equal(parsed.data.store.structures.length, 0);
  assert.equal(parsed.data.store.mods.map.fogWidth, 256);
  const player = parsed.data.store.player;
  assert.ok(player.x >= 0 && player.x < 1024 * 4);
  assert.ok(player.y >= 0 && player.y < 1024 * 4);

  const edited = Buffer.from("player-edit");
  writeFileSync(first.filePath, edited);
  const again = ensureNamedVoidSave(dest, "author.template");
  assert.equal(again.created, false);
  assert.equal(readFileSync(first.filePath).equals(edited), true);
});

test("ensureModDebugSaves writes Steam save only, without overwrite", () => {
  const src = join(TMP, "src-debug-saves");
  const userData = join(TMP, "user-debug-saves");
  rmSync(src, { recursive: true, force: true });
  rmSync(userData, { recursive: true, force: true });
  mkdirSync(src, { recursive: true });
  const first = ensureModDebugSaves({ gameId: "unit.debug", dir: src, name: "Debug Unit" }, userData);
  assert.equal(first.created, true);
  assert.equal(first.id, "unit.debug");
  assert.equal(first.filePath, join(userData, "saves", "unit.debug.save"));
  assert.equal(existsSync(join(src, "unit.debug.save")), false);
  const steam = parseSaveFile(first.filePath);
  assert.equal(steam.meta.id, "unit.debug");
  assert.equal(steam.meta.name, "unit.debug");
  assert.equal(existsSync(join(userData, "meta", "lastPlayedGame.json")), false);

  const edited = Buffer.from("steam-edit");
  writeFileSync(first.filePath, edited);
  const again = ensureModDebugSaves({ gameId: "unit.debug", dir: src, name: "Debug Unit" }, userData);
  assert.equal(again.created, false);
  assert.equal(readFileSync(first.filePath).equals(edited), true);
  assert.equal(existsSync(join(src, "unit.debug.save")), false);
});

test("ensureAllModDebugSaves creates one Steam save per mod", () => {
  const userData = join(TMP, "user-all-saves");
  const a = join(TMP, "src-all-a");
  const b = join(TMP, "src-all-b");
  rmSync(userData, { recursive: true, force: true });
  rmSync(a, { recursive: true, force: true });
  rmSync(b, { recursive: true, force: true });
  mkdirSync(a, { recursive: true });
  mkdirSync(b, { recursive: true });
  const results = ensureAllModDebugSaves(
    [
      { gameId: "unit.a", dir: a, name: "A" },
      { gameId: "unit.b", dir: b, name: "B" },
    ],
    userData,
  );
  assert.equal(results.length, 2);
  assert.equal(results[0].id, "unit.a");
  assert.equal(results[1].id, "unit.b");
  assert.equal(parseSaveFile(results[0].filePath).meta.name, "unit.a");
  assert.equal(parseSaveFile(results[1].filePath).meta.name, "unit.b");
  assert.equal(existsSync(join(a, "unit.a.save")), false);
  assert.equal(existsSync(join(b, "unit.b.save")), false);
});

test("writeSteamLastPlayed writes meta/lastPlayedGame.json", () => {
  const userData = join(TMP, "user-data");
  writeSteamLastPlayed("author.template", userData);
  const raw = JSON.parse(readFileSync(join(userData, "meta", "lastPlayedGame.json"), "utf8"));
  assert.equal(raw.id, "author.template");
});

function writeMetaSave(dir, meta) {
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${meta.id}.save`), `${JSON.stringify(meta)}\n`);
}

test("latestSteamSaveForWorld picks newest timestamp in that world", () => {
  const userData = join(TMP, "user-latest-world");
  const saves = join(userData, "saves");
  rmSync(userData, { recursive: true, force: true });
  writeMetaSave(saves, {
    id: "unit.world",
    worldId: "unit.world",
    timestamp: "2026-01-01T00:00:00.000Z",
  });
  writeMetaSave(saves, {
    id: "abc123save",
    worldId: "unit.world",
    timestamp: "2026-08-15T12:00:00.000Z",
  });
  writeMetaSave(saves, {
    id: "unit.world-autosave-2",
    worldId: "unit.world",
    timestamp: "2026-08-20T09:00:00.000Z",
  });
  writeMetaSave(saves, {
    id: "other.mod-autosave-1",
    worldId: "other.mod",
    timestamp: "2026-12-01T00:00:00.000Z",
  });

  const listed = listSteamSavesForWorld("unit.world", userData);
  assert.equal(listed.length, 3);
  const latest = latestSteamSaveForWorld("unit.world", userData);
  assert.equal(latest?.id, "unit.world-autosave-2");
  assert.equal(latestSteamSaveForWorld("missing.world", userData), null);
});
