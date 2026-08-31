import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  findModSaveFile,
  installModSaveToSteam,
  pickSaveInDir,
  sanitizeSaveId,
  writeSteamLastPlayed,
} from "./debug-save.js";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const TMP = join(ROOT, ".tmp", "debug-save-unit");

test("sanitizeSaveId keeps dots and replaces spaces", () => {
  assert.equal(sanitizeSaveId("irishbruse.dev-tools"), "irishbruse.dev-tools");
  assert.equal(sanitizeSaveId("a b"), "a_b");
});

test("pickSaveInDir prefers gameId.save then sorted name", () => {
  const dir = join(TMP, "saves-pick");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "zzz.save"), "z");
  assert.equal(pickSaveInDir(dir, "missing"), join(dir, "zzz.save"));
  writeFileSync(join(dir, "unit.mod.save"), "a");
  assert.equal(pickSaveInDir(dir, "unit.mod"), join(dir, "unit.mod.save"));
});

test("findModSaveFile prefers the installed mods folder", () => {
  const src = join(TMP, "src-mod");
  const installed = join(TMP, "installed-mod");
  mkdirSync(join(src, "mod"), { recursive: true });
  mkdirSync(installed, { recursive: true });
  writeFileSync(join(src, "mod", "unit.mod.save"), "src");
  writeFileSync(join(installed, "unit.mod.save"), "os");
  assert.equal(findModSaveFile("unit.mod", src, installed), join(installed, "unit.mod.save"));
});

test("findModSaveFile falls back to source mod/", () => {
  const src = join(TMP, "src-fallback");
  mkdirSync(join(src, "mod"), { recursive: true });
  writeFileSync(join(src, "mod", "unit.fallback.save"), "src");
  assert.equal(
    findModSaveFile("unit.fallback", src, join(TMP, "installed-missing")),
    join(src, "mod", "unit.fallback.save"),
  );
});

test("installModSaveToSteam copies into user-data saves", () => {
  const src = join(TMP, "src-install");
  mkdirSync(join(src, "mod"), { recursive: true });
  writeFileSync(
    join(src, "mod", "unit.install.save"),
    `${JSON.stringify({ id: "unit.install" })}\n{}`,
  );
  const userData = join(TMP, "user-data-install");
  const installed = installModSaveToSteam(
    { gameId: "unit.install", dir: src },
    userData,
    join(TMP, "installed-missing"),
  );
  assert.ok(installed);
  assert.equal(installed.id, "unit.install");
  assert.equal(installed.filePath, join(userData, "saves", "unit.install.save"));
});

test("installModSaveToSteam is null when the mod has no save", () => {
  const src = join(TMP, "src-empty");
  mkdirSync(src, { recursive: true });
  assert.equal(
    installModSaveToSteam(
      { gameId: "unit.none", dir: src },
      join(TMP, "user-empty"),
      join(TMP, "no-os"),
    ),
    null,
  );
});

test("writeSteamLastPlayed writes meta/lastPlayedGame.json", () => {
  const userData = join(TMP, "user-data");
  writeSteamLastPlayed("author.template", userData);
  const raw = JSON.parse(readFileSync(join(userData, "meta", "lastPlayedGame.json"), "utf8"));
  assert.equal(raw.id, "author.template");
});
