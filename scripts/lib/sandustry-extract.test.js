import assert from "node:assert/strict";
import {
  existsSync,
  lstatSync,
  mkdtempSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createPackage } from "@electron/asar";
import {
  EXTRACT_ROOT_OS_LINKS,
  LEGACY_CURRENT_LINK,
  SOURCE_DIR,
  bundleHasSandkit,
  cleanupOrphanedFlatExtract,
  gameSourceDir,
  isVersionedExtractFolder,
  migrateLegacyFlatExtract,
  readBundleSandkitFromAsar,
  removeLegacyCurrentLink,
  removeLegacyVersionedExtracts,
  resolveGameBranchKey,
  sandustryExtractRoot,
} from "./sandustry-extract.js";

test("resolveGameBranchKey prefers Steam beta, then sandkit, then release", () => {
  assert.equal(resolveGameBranchKey("mods", false), "mods");
  assert.equal(resolveGameBranchKey("", true), "mods");
  assert.equal(resolveGameBranchKey("", false), "release");
  assert.equal(resolveGameBranchKey("0.5.5", true), "mods");
});

test("bundleHasSandkit detects sandkit marker", () => {
  assert.equal(bundleHasSandkit("// no kit\n"), false);
  assert.equal(bundleHasSandkit("var sandkit = {};\n"), true);
});

test("readBundleSandkitFromAsar uses listed entry paths for extractFile", async () => {
  const root = mkdtempSync(join(tmpdir(), "sandustry-asar-"));
  const src = join(root, "src");
  const asarPath = join(root, "app.asar");
  try {
    mkdirSync(join(src, "dist", "js"), { recursive: true });
    writeFileSync(join(src, "dist", "js", "bundle.js"), "var sandkit = {};\n");

    await createPackage(src, asarPath);

    const posixListed = ["/dist/js/bundle.js"];
    assert.deepEqual(readBundleSandkitFromAsar(asarPath, posixListed), {
      rel: "dist/js/bundle.js",
      hasSandkit: true,
    });

    const winListed = ["\\dist\\js\\bundle.js"];
    if (process.platform === "win32") {
      assert.deepEqual(readBundleSandkitFromAsar(asarPath, winListed), {
        rel: "dist/js/bundle.js",
        hasSandkit: true,
      });
    } else {
      assert.equal(readBundleSandkitFromAsar(asarPath, winListed), null);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("isVersionedExtractFolder matches version-branch names", () => {
  assert.equal(isVersionedExtractFolder("0.5.2-mods"), true);
  assert.equal(isVersionedExtractFolder("current"), false);
  assert.equal(isVersionedExtractFolder("source"), false);
});

test("migrateLegacyFlatExtract moves flat files into sandustry/source/", () => {
  const root = mkdtempSync(join(tmpdir(), "sandustry-extract-"));
  try {
    mkdirSync(join(root, "dist", "js"), { recursive: true });
    writeFileSync(join(root, "main.js"), "// main\n");
    writeFileSync(join(root, "package.json"), JSON.stringify({ version: "0.5.2" }));
    writeFileSync(join(root, "dist", "js", "bundle.js"), "sandkit\n");

    const migrated = migrateLegacyFlatExtract(root);
    assert.equal(migrated, true);
    assert.equal(readFileSync(join(root, SOURCE_DIR, "main.js"), "utf8"), "// main\n");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("cleanupOrphanedFlatExtract removes flat leftovers without main.js", () => {
  const root = mkdtempSync(join(tmpdir(), "sandustry-cleanup-"));
  try {
    mkdirSync(join(root, SOURCE_DIR), { recursive: true });
    mkdirSync(join(root, "dist", "js"), { recursive: true });
    writeFileSync(join(root, "package.json"), JSON.stringify({ version: "0.5.2" }));
    writeFileSync(join(root, "dist", "js", "bundle.js"), "sandkit\n");

    cleanupOrphanedFlatExtract(root);
    assert.equal(readdirSync(root).sort().join(","), SOURCE_DIR);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("cleanupOrphanedFlatExtract keeps saves, workshop, and logs links", () => {
  const root = mkdtempSync(join(tmpdir(), "sandustry-keep-links-"));
  try {
    mkdirSync(join(root, SOURCE_DIR), { recursive: true });
    mkdirSync(join(root, "saves"), { recursive: true });
    mkdirSync(join(root, "workshop"), { recursive: true });
    mkdirSync(join(root, "logs"), { recursive: true });
    writeFileSync(join(root, "package.json"), JSON.stringify({ version: "0.5.2" }));
    writeFileSync(join(root, "orphan.txt"), "gone");

    cleanupOrphanedFlatExtract(root);
    const names = readdirSync(root).sort();
    assert.deepEqual(names, ["logs", "saves", SOURCE_DIR, "workshop"]);
    assert.deepEqual(EXTRACT_ROOT_OS_LINKS, ["saves", "workshop", "logs"]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("removeLegacyVersionedExtracts deletes version-branch folders", () => {
  const root = mkdtempSync(join(tmpdir(), "sandustry-versioned-"));
  try {
    mkdirSync(join(root, "0.5.2-mods"), { recursive: true });
    mkdirSync(join(root, SOURCE_DIR), { recursive: true });
    writeFileSync(join(root, "0.5.2-mods", "marker.txt"), "old");

    removeLegacyVersionedExtracts(root);
    assert.equal(existsSync(join(root, "0.5.2-mods")), false);
    assert.equal(existsSync(join(root, SOURCE_DIR)), true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("removeLegacyCurrentLink deletes sandustry/current", () => {
  const repo = mkdtempSync(join(tmpdir(), "sandustry-repo-"));
  const extractRoot = sandustryExtractRoot(repo);
  const dest = gameSourceDir(extractRoot);
  try {
    mkdirSync(dest, { recursive: true });
    symlinkSync(dest, join(extractRoot, LEGACY_CURRENT_LINK));
    assert.ok(lstatSync(join(extractRoot, LEGACY_CURRENT_LINK)).isSymbolicLink());
    removeLegacyCurrentLink(extractRoot);
    assert.equal(existsSync(join(extractRoot, LEGACY_CURRENT_LINK)), false);
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});
