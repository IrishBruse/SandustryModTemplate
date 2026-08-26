import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import {
  CURRENT_EXTRACT_LINK,
  bundleHasSandkit,
  cleanupOrphanedFlatExtract,
  gameExtractFolderName,
  isVersionedExtractFolder,
  migrateLegacyFlatExtract,
  resolveCurrentSandustryExtract,
  resolveGameBranchKey,
  sandustryExtractRoot,
  updateCurrentExtractLink,
} from "./sandustry-extract.js";

test("gameExtractFolderName combines version and branch", () => {
  assert.equal(gameExtractFolderName("0.5.2", "mods"), "0.5.2-mods");
  assert.equal(gameExtractFolderName("", "mods"), "unknown-mods");
  assert.equal(gameExtractFolderName("0.5.2", ""), "0.5.2-release");
});

test("resolveGameBranchKey prefers Steam beta, then sandkit, then release", () => {
  assert.equal(resolveGameBranchKey("mods", false), "mods");
  assert.equal(resolveGameBranchKey("", true), "mods");
  assert.equal(resolveGameBranchKey("", false), "release");
});

test("bundleHasSandkit detects sandkit marker", () => {
  assert.equal(bundleHasSandkit("// no kit\n"), false);
  assert.equal(bundleHasSandkit("var sandkit = {};\n"), true);
});

test("isVersionedExtractFolder matches version-branch names", () => {
  assert.equal(isVersionedExtractFolder("0.5.2-mods"), true);
  assert.equal(isVersionedExtractFolder("current"), false);
  assert.equal(isVersionedExtractFolder("0.5.2"), false);
});

test("migrateLegacyFlatExtract moves flat files into a version folder", () => {
  const root = mkdtempSync(join(tmpdir(), "sandustry-extract-"));
  try {
    mkdirSync(join(root, "dist", "js"), { recursive: true });
    writeFileSync(join(root, "main.js"), "// main\n");
    writeFileSync(join(root, "package.json"), JSON.stringify({ version: "0.5.2" }));
    writeFileSync(join(root, "dist", "js", "bundle.js"), "sandkit\n");

    const folder = migrateLegacyFlatExtract(root);
    assert.equal(folder, "0.5.2-mods");
    assert.equal(readFileSync(join(root, "0.5.2-mods", "main.js"), "utf8"), "// main\n");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("updateCurrentExtractLink creates sandustry/current", () => {
  const repo = mkdtempSync(join(tmpdir(), "sandustry-repo-"));
  const extractRoot = sandustryExtractRoot(repo);
  const dest = join(extractRoot, "0.5.2-mods");
  try {
    mkdirSync(dest, { recursive: true });
    updateCurrentExtractLink(extractRoot, "0.5.2-mods");
    const link = join(extractRoot, CURRENT_EXTRACT_LINK);
    assert.equal(resolve(extractRoot, readlinkSync(link)), dest);
    assert.equal(resolveCurrentSandustryExtract(repo), dest);
    assert.equal(updateCurrentExtractLink(extractRoot, "0.5.2-mods"), "already");
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});

test("cleanupOrphanedFlatExtract removes flat leftovers without main.js", () => {
  const root = mkdtempSync(join(tmpdir(), "sandustry-cleanup-"));
  try {
    mkdirSync(join(root, "0.5.2-mods"), { recursive: true });
    mkdirSync(join(root, "dist", "js"), { recursive: true });
    writeFileSync(join(root, "package.json"), JSON.stringify({ version: "0.5.2" }));
    writeFileSync(join(root, "dist", "js", "bundle.js"), "sandkit\n");

    cleanupOrphanedFlatExtract(root);
    assert.equal(readdirSync(root).sort().join(","), "0.5.2-mods");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
