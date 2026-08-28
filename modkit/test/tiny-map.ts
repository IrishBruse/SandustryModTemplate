import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { rgbPng } from "./png.ts";

/** Custom-map mod id. Passed to `api.maps.start`. */
export const TINY_MAP_ID = "sandustry-test.tiny-map";

/** 2×2 chunks (`chunkSize` 40). Vanilla campaign maps are 3840×3840. */
export const TINY_MAP_WIDTH = 80;
export const TINY_MAP_HEIGHT = 80;

const AIR: readonly [number, number, number] = [255, 255, 255];
/** Non-reserved RGB. Mapped to CellType `Dirt` (not structure Block). */
const FLOOR: readonly [number, number, number] = [0, 200, 0];
const FLOOR_TOP = TINY_MAP_HEIGHT - 8;
const SPAWN_X = 40;
const SPAWN_Y = FLOOR_TOP - 4;

function blank(_x: number, _y: number): readonly [number, number, number] {
  return AIR;
}

function terrain(_x: number, y: number): readonly [number, number, number] {
  if (y >= FLOOR_TOP) return FLOOR;
  return AIR;
}

function writePng(
  dir: string,
  name: string,
  pixel: (x: number, y: number) => readonly [number, number, number],
): void {
  writeFileSync(join(dir, name), rgbPng(TINY_MAP_WIDTH, TINY_MAP_HEIGHT, pixel));
}

export function tinyMapManifest(): Record<string, unknown> {
  return {
    manifestVersion: 1,
    id: TINY_MAP_ID,
    name: "sandustry-test tiny map",
    version: "0.0.1",
    apiVersion: 1,
    entry: "main.js",
    dependencies: [],
    loadOrder: -1,
    map: {
      blueprints: {
        terrain: "map/terrain.png",
        lights: "map/lights.png",
        sensors: "map/sensors.png",
        authorization: "map/authorization.png",
      },
      width: TINY_MAP_WIDTH,
      height: TINY_MAP_HEIGHT,
      spawn: { x: SPAWN_X, y: SPAWN_Y },
      unstuck: { x: SPAWN_X, y: SPAWN_Y },
      deployment: "skip",
      topBounds: { hard: 0, soft: 16 },
      depthLight: { startY: 40, endY: 80, maxSize: 40, minSize: 8 },
      parallax: { widthScale: 1, offsetY: 0 },
      colorMappings: {
        "0, 200, 0": "Dirt",
      },
    },
  };
}

const START_MAIN = `globalThis.sandkit = sandkit;
try {
  const maps = sandkit.api.maps;
  if (maps.getActive() == null) {
    maps.start(${JSON.stringify(TINY_MAP_ID)});
  }
} catch (error) {
  console.error("tiny-map start", error);
}
`;

/** Write the tiny custom-map mod into the test mods folder. */
export function writeTinyTestMap(modsRoot: string): string {
  const dir = join(modsRoot, TINY_MAP_ID);
  const mapDir = join(dir, "map");
  mkdirSync(mapDir, { recursive: true });
  writeFileSync(join(dir, "modinfo.json"), `${JSON.stringify(tinyMapManifest(), null, 2)}\n`);
  writeFileSync(join(dir, "main.js"), START_MAIN);
  writePng(mapDir, "terrain.png", terrain);
  writePng(mapDir, "lights.png", blank);
  writePng(mapDir, "sensors.png", blank);
  writePng(mapDir, "authorization.png", blank);
  return TINY_MAP_ID;
}
