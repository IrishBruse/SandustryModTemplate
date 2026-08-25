import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { linkDirectory, samePath, sandustryUserDataDir } from "./paths.js";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

test("sandustryUserDataDir uses APPDATA on Windows and ~/.config on Unix", () => {
  if (process.platform === "win32") {
    const appData = process.env.APPDATA || join(homedir(), "AppData", "Roaming");
    assert.equal(sandustryUserDataDir(), join(appData, "sandustry"));
    return;
  }
  assert.equal(sandustryUserDataDir(), join(homedir(), ".config", "sandustry"));
});

test("samePath is case-insensitive only on Windows", () => {
  if (process.platform === "win32") {
    assert.equal(samePath("C:\\Mods\\A", "c:/mods/a"), true);
    return;
  }
  assert.equal(samePath("/mods/A", "/mods/a"), false);
  assert.equal(samePath("/mods/a", "/mods/a"), true);
});

test("linkDirectory writes a directory that can be read through the link", () => {
  mkdirSync(join(ROOT, ".tmp"), { recursive: true });
  const root = mkdtempSync(join(ROOT, ".tmp", "paths-link-"));
  try {
    const target = join(root, "target");
    const link = join(root, "link");
    mkdirSync(target);
    writeFileSync(join(target, "probe.txt"), "ok");
    linkDirectory(target, link);
    assert.equal(readFileSync(join(link, "probe.txt"), "utf8"), "ok");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
