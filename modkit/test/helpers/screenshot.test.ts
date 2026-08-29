import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { PNG } from "pngjs";
import {
  assertImageSnapshot,
  callerTestFile,
  comparePng,
  isCi,
  resolveSnapshotPath,
  shouldUpdateSnapshots,
  snapshotFileName,
} from "./screenshot.ts";

function rgbPng(
  width: number,
  height: number,
  pixel: (x: number, y: number) => readonly [number, number, number],
): Buffer {
  const png = new PNG({ width, height });
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [r, g, b] = pixel(x, y);
      const i = (png.width * y + x) << 2;
      png.data[i] = r;
      png.data[i + 1] = g;
      png.data[i + 2] = b;
      png.data[i + 3] = 255;
    }
  }
  return PNG.sync.write(png);
}

function solidPng(width: number, height: number, rgb: readonly [number, number, number]): Buffer {
  return rgbPng(width, height, () => rgb);
}

test("comparePng matches identical images", () => {
  const png = solidPng(4, 4, [0, 200, 0]);
  const result = comparePng(png, png);
  assert.equal(result.ok, true);
  assert.equal(result.diffPixels, 0);
});

test("comparePng fails when pixels differ", () => {
  const a = solidPng(4, 4, [0, 200, 0]);
  const b = solidPng(4, 4, [200, 0, 0]);
  const result = comparePng(a, b);
  assert.equal(result.ok, false);
  assert.equal(result.diffPixels, 16);
  assert.ok(result.diffPng);
});

test("comparePng fails when sizes differ", () => {
  const a = solidPng(4, 4, [0, 200, 0]);
  const b = solidPng(8, 4, [0, 200, 0]);
  const result = comparePng(a, b);
  assert.equal(result.ok, false);
  assert.match(result.message, /sizes differ/);
});

test("comparePng allows a pixel budget", () => {
  const a = rgbPng(2, 1, (x) => (x === 0 ? [0, 0, 0] : [255, 255, 255]));
  const b = solidPng(2, 1, [0, 0, 0]);
  assert.equal(comparePng(a, b).ok, false);
  assert.equal(comparePng(a, b, { maxDiffPixels: 1 }).ok, true);
  assert.equal(comparePng(a, b, { maxDiffPixels: 0 }).ok, false);
});

test("snapshotFileName adds chromium and platform", () => {
  assert.equal(snapshotFileName("void-world.png", "linux"), "void-world-chromium-linux.png");
  assert.equal(snapshotFileName("hud", "darwin"), "hud-chromium-darwin.png");
});

test("resolveSnapshotPath uses the Playwright folder next to the test file", () => {
  const testFile = "/repo/modkit/test/game.integration.test.ts";
  assert.equal(
    resolveSnapshotPath("void-world.png", testFile),
    join(`${testFile}-snapshots`, snapshotFileName("void-world.png")),
  );
});

test("callerTestFile skips helper frames", () => {
  const file = "/home/econn/git/modkit/test/game.integration.test.ts";
  const stack = [
    "Error",
    "    at callerTestFile (/home/econn/git/modkit/test/helpers/screenshot.ts:10:5)",
    "    at Object.toHaveScreenshot (/home/econn/git/modkit/test/helpers/expect.ts:40:11)",
    `    at TestContext.<anonymous> (${file}:12:3)`,
  ].join("\n");
  assert.equal(callerTestFile(stack), file);
});

test("shouldUpdateSnapshots reads the Node test flag", () => {
  assert.equal(shouldUpdateSnapshots(["node", "--test"]), false);
  assert.equal(shouldUpdateSnapshots(["node", "--test-update-snapshots"]), true);
});

test("isCi reads CI", () => {
  assert.equal(isCi({}), false);
  assert.equal(isCi({ CI: "true" }), true);
  assert.equal(isCi({ CI: "1" }), true);
});

test("assertImageSnapshot writes a missing snapshot and then fails", () => {
  const dir = mkdtempSync(join(tmpdir(), "sandustry-snap-"));
  const snapshotPath = join(dir, "missing.png");
  const png = solidPng(4, 4, [0, 200, 0]);
  assert.throws(
    () => assertImageSnapshot(png, snapshotPath, { ci: false, update: false }),
    /not found, wrote/,
  );
  assert.ok(existsSync(snapshotPath));
  assert.deepEqual(readFileSync(snapshotPath), png);
});

test("assertImageSnapshot does not write a missing snapshot in CI", () => {
  const dir = mkdtempSync(join(tmpdir(), "sandustry-snap-"));
  const snapshotPath = join(dir, "missing.png");
  const png = solidPng(4, 4, [0, 200, 0]);
  assert.throws(
    () => assertImageSnapshot(png, snapshotPath, { ci: true, update: false }),
    /snapshot missing/,
  );
  assert.equal(existsSync(snapshotPath), false);
});

test("assertImageSnapshot writes on update and then matches", () => {
  const dir = mkdtempSync(join(tmpdir(), "sandustry-snap-"));
  const snapshotPath = join(dir, "ok.png");
  const png = solidPng(4, 4, [0, 200, 0]);
  assertImageSnapshot(png, snapshotPath, { ci: true, update: true });
  assertImageSnapshot(png, snapshotPath, { ci: false, update: false });
});

test("assertImageSnapshot writes actual expected and diff on mismatch", () => {
  const dir = mkdtempSync(join(tmpdir(), "sandustry-snap-"));
  const snapshotPath = join(dir, "mismatch.png");
  const artifactsDir = join(dir, "out");
  assertImageSnapshot(solidPng(4, 4, [0, 200, 0]), snapshotPath, { ci: false, update: true });
  assert.throws(
    () =>
      assertImageSnapshot(solidPng(4, 4, [200, 0, 0]), snapshotPath, {
        ci: false,
        update: false,
        artifactsDir,
      }),
    /Screenshot comparison failed/,
  );
  assert.ok(existsSync(join(artifactsDir, "mismatch-actual.png")));
  assert.ok(existsSync(join(artifactsDir, "mismatch-expected.png")));
  assert.ok(existsSync(join(artifactsDir, "mismatch-diff.png")));
});
