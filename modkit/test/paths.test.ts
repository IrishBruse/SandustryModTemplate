import assert from "node:assert/strict";
import test from "node:test";
import { join } from "node:path";
import {
  installedModMain,
  sandustryModsDir,
  sandustryTestUserDataDir,
  sandustryUserDataDir,
} from "./paths.ts";
import { companionSettings } from "./mods.ts";

test("installedModMain joins the isolated test mods folder", () => {
  const userData = sandustryTestUserDataDir();
  assert.ok(userData.endsWith(join(".tmp", "sandustry-test")));
  assert.equal(sandustryModsDir(), join(userData, "mods"));
  assert.equal(
    installedModMain("author.template"),
    join(userData, "mods", "author.template", "main.js"),
  );
  assert.ok(sandustryUserDataDir().endsWith("sandustry"));
  assert.notEqual(userData, sandustryUserDataDir());
});

test("companionSettings enables watch and disables auto-load for hot-reload", () => {
  const settings = companionSettings(["hot-reload", "author.template"]) as {
    externalModSettings: {
      "hot-reload": { watchLocalMods: boolean; autoLoad: boolean; openDevTools: boolean };
      "author.template": { enabled: boolean };
    };
  };
  const companion = settings.externalModSettings["hot-reload"];
  assert.equal(companion.watchLocalMods, true);
  assert.equal(companion.autoLoad, false);
  assert.equal(companion.openDevTools, false);
  assert.equal(settings.externalModSettings["author.template"].enabled, true);
});
