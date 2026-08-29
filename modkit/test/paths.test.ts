import assert from "node:assert/strict";
import test from "node:test";
import { join } from "node:path";
import {
  installedModFile,
  installedModMain,
  sandustryModsDir,
  sandustryTestUserDataDir,
  sandustryUserDataDir,
} from "./paths.ts";

test("installedModMain joins the isolated test mods folder", () => {
  const userData = sandustryTestUserDataDir();
  assert.ok(userData.endsWith(join(".tmp", "sandustry-test")));
  assert.equal(sandustryModsDir(), join(userData, "mods"));
  assert.equal(
    installedModMain("author.template"),
    join(userData, "mods", "author.template", "main.js"),
  );
  assert.equal(
    installedModFile("example.worker-api", "worker.js"),
    join(userData, "mods", "example.worker-api", "worker.js"),
  );
  assert.ok(sandustryUserDataDir().endsWith("sandustry"));
  assert.notEqual(userData, sandustryUserDataDir());
});
