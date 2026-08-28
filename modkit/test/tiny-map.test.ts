import assert from "node:assert/strict";
import { mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { rgbPng } from "./png.ts";
import { TINY_MAP_HEIGHT, TINY_MAP_ID, TINY_MAP_WIDTH, writeTinyTestMap } from "./tiny-map.ts";
import { repoRoot } from "./paths.ts";

test("rgbPng writes a PNG signature", () => {
  const buf = rgbPng(2, 2, () => [0, 200, 0]);
  assert.deepEqual([...buf.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.ok(buf.length > 32);
});

test("writeTinyTestMap writes an 80x80 custom map mod", () => {
  const dir = join(repoRoot(), ".tmp", "tiny-map-unit");
  mkdirSync(dir, { recursive: true });
  const id = writeTinyTestMap(dir);
  assert.equal(id, TINY_MAP_ID);
  const info = JSON.parse(readFileSync(join(dir, id, "modinfo.json"), "utf8")) as {
    map: { width: number; height: number };
  };
  assert.equal(info.map.width, TINY_MAP_WIDTH);
  assert.equal(info.map.height, TINY_MAP_HEIGHT);
  const png = readFileSync(join(dir, id, "map", "terrain.png"));
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
});
