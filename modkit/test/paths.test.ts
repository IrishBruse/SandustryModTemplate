import assert from "node:assert/strict";
import test from "node:test";
import { join } from "node:path";
import { installedModMain, sandustryModsDir, sandustryUserDataDir } from "./paths.ts";

test("installedModMain joins the OS mods folder", () => {
  const userData = sandustryUserDataDir();
  assert.equal(sandustryModsDir(), join(userData, "mods"));
  assert.equal(
    installedModMain("author.template"),
    join(userData, "mods", "author.template", "main.js"),
  );
  assert.ok(userData.endsWith("sandustry"));
});
