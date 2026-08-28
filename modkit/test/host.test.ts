import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { chromeLaunchArgs, hostWindowMode, useSwiftShader } from "./chrome.ts";
import { resolveHostStaticFile } from "./host.ts";

test("hostWindowMode is headless when not visible", () => {
  assert.equal(hostWindowMode({ platform: "win32" }), "headless");
  assert.equal(hostWindowMode({ platform: "linux", display: undefined }), "headless");
  assert.equal(hostWindowMode({ platform: "linux", display: ":1" }), "headless");
  assert.equal(hostWindowMode({ platform: "darwin", display: undefined }), "headless");
});

test("hostWindowMode uses a window only when visible and a display exists", () => {
  assert.equal(hostWindowMode({ visible: true, platform: "win32" }), "window");
  assert.equal(hostWindowMode({ visible: true, platform: "linux", display: ":1" }), "window");
});

test("hostWindowMode is headless when visible is requested without DISPLAY on Unix", () => {
  assert.equal(
    hostWindowMode({ visible: true, platform: "linux", display: undefined }),
    "headless",
  );
});

test("chromeLaunchArgs uses SwiftShader only in CI", () => {
  for (const mode of ["headless", "xvfb", "window"] as const) {
    const args = chromeLaunchArgs(mode);
    assert.ok(args.includes("--use-gl=angle"), mode);
    assert.ok(args.includes("--renderer-process-limit=2"), mode);
    assert.ok(args.includes("--num-raster-threads=1"), mode);
    if (process.env.CI) {
      assert.ok(args.includes("--use-angle=swiftshader"), mode);
      assert.ok(args.includes("--enable-unsafe-swiftshader"), mode);
    } else {
      assert.ok(!args.includes("--use-angle=swiftshader"), mode);
      assert.ok(!args.includes("--disable-background-timer-throttling"), mode);
    }
  }
  assert.equal(useSwiftShader(), Boolean(process.env.CI));
});

test("chromeLaunchArgs pins ozone screen size in headless", () => {
  const headless = chromeLaunchArgs("headless");
  assert.ok(headless.includes("--ozone-override-screen-size=1280,720"));
  const window = chromeLaunchArgs("window");
  assert.ok(!window.some((arg) => arg.startsWith("--ozone-override-screen-size=")));
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
