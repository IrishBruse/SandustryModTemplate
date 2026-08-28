import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { hostWindowMode } from "./chrome.ts";
import { resolveHostStaticFile } from "./host.ts";

test("hostWindowMode uses a window when visible and a display exists", () => {
  assert.equal(hostWindowMode({ visible: true, platform: "win32" }), "window");
  assert.equal(hostWindowMode({ visible: true, platform: "linux", display: ":1" }), "window");
});

test("hostWindowMode is headless on Windows by default", () => {
  assert.equal(hostWindowMode({ platform: "win32" }), "headless");
});

test("hostWindowMode uses xvfb on Unix when there is no DISPLAY", () => {
  assert.equal(hostWindowMode({ visible: true, platform: "linux", display: undefined }), "xvfb");
  assert.equal(hostWindowMode({ platform: "linux", display: undefined }), "xvfb");
  assert.equal(hostWindowMode({ platform: "darwin", display: undefined }), "xvfb");
});

test("resolveHostStaticFile prefers live /mods/<id>/ then vanilla dist/mods", () => {
  const root = mkdtempSync(join(tmpdir(), "sandustry-host-"));
  const distMods = join(root, "dist", "mods");
  const live = join(root, "live", "author.template");
  mkdirSync(distMods, { recursive: true });
  mkdirSync(live, { recursive: true });
  writeFileSync(join(distMods, "minimap_icon.png"), "vanilla");
  writeFileSync(join(live, "main.js"), "live");
  const distDir = join(root, "dist");
  const testMods = join(root, "live");
  assert.equal(
    resolveHostStaticFile(distDir, testMods, "/mods/minimap_icon.png"),
    join(distMods, "minimap_icon.png"),
  );
  assert.equal(
    resolveHostStaticFile(distDir, testMods, "/mods/author.template/main.js"),
    join(live, "main.js"),
  );
});
