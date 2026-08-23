import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import {
  boundsFromMarquee,
  boundsFromPoints,
  boundsFromStructures,
  cellIsVisible,
  clearMarqueeSelection,
  getSelectionCellBounds,
  tightenBoundsToMapData,
} from "./selectionBounds.ts";

const previousSandkit = globalThis.sandkit;

afterEach(() => {
  globalThis.sandkit = previousSandkit;
});

function installSandkit(session: object, shared: object = {}) {
  globalThis.sandkit = {
    state: { session, shared },
    api: {
      rendering: {
        getGridMetrics: () => ({ snapGridCellSize: 4 }),
      },
    },
    enums: { ComponentId: { ShortcutHelper: 1 } },
  };
}

test("boundsFromPoints returns null for an empty list", () => {
  assert.equal(boundsFromPoints([]), null);
});

test("boundsFromPoints is an inclusive AABB", () => {
  assert.deepEqual(
    boundsFromPoints([
      { x: 10, y: 2 },
      { x: 4, y: 8 },
    ]),
    { minX: 4, minY: 2, maxX: 10, maxY: 8 },
  );
});

test("boundsFromMarquee treats end as exclusive on the max edges", () => {
  assert.deepEqual(boundsFromMarquee({ x: 0, y: 0 }, { x: 4, y: 3 }), {
    minX: 0,
    minY: 0,
    maxX: 3,
    maxY: 2,
  });
});

test("boundsFromMarquee stays at least one cell when start equals end", () => {
  assert.deepEqual(boundsFromMarquee({ x: 5, y: 5 }, { x: 5, y: 5 }), {
    minX: 5,
    minY: 5,
    maxX: 5,
    maxY: 5,
  });
});

test("boundsFromMarquee works when the drag goes up and left", () => {
  assert.deepEqual(boundsFromMarquee({ x: 8, y: 8 }, { x: 2, y: 3 }), {
    minX: 2,
    minY: 3,
    maxX: 7,
    maxY: 7,
  });
});

test("boundsFromStructures uses originalPos and snap cell size", () => {
  assert.deepEqual(boundsFromStructures([{ x: 0, y: 0, originalPos: { x: 10, y: 20 } }], 4), {
    minX: 10,
    minY: 20,
    maxX: 13,
    maxY: 23,
  });
});

test("boundsFromStructures skips entries without originalPos", () => {
  assert.equal(boundsFromStructures([{ x: 1, y: 1 }], 4), null);
});

test("cellIsVisible is true when alpha or a channel is above 8", () => {
  assert.equal(cellIsVisible(0, 0, 0, 8), true);
  assert.equal(cellIsVisible(9, 0, 0, 0), true);
  assert.equal(cellIsVisible(0, 0, 0, 7), false);
});

test("tightenBoundsToMapData crops to visible map pixels", () => {
  const width = 4;
  const height = 4;
  const data = new Uint8ClampedArray(width * height * 4);
  const set = (x: number, y: number) => {
    const i = 4 * (x + y * width);
    data[i] = 255;
    data[i + 3] = 255;
  };
  set(1, 1);
  set(2, 2);
  assert.deepEqual(
    tightenBoundsToMapData({ minX: 0, minY: 0, maxX: 3, maxY: 3 }, { data, width, height }),
    { minX: 1, minY: 1, maxX: 2, maxY: 2 },
  );
});

test("tightenBoundsToMapData keeps the input when no cell is visible", () => {
  const bounds = { minX: 0, minY: 0, maxX: 1, maxY: 1 };
  const data = new Uint8ClampedArray(4 * 4 * 4);
  assert.deepEqual(tightenBoundsToMapData(bounds, { data, width: 4, height: 4 }), bounds);
});

test("getSelectionCellBounds returns null when the marquee is off", () => {
  installSandkit({ action: { customData: { marqueeSelected: false } } });
  assert.equal(getSelectionCellBounds(), null);
});

test("getSelectionCellBounds uses the marquee start and end", () => {
  installSandkit({
    action: {
      customData: {
        marqueeSelected: true,
        start: { x: 0, y: 0 },
        end: { x: 5, y: 2 },
      },
    },
  });
  assert.deepEqual(getSelectionCellBounds(), { minX: 0, minY: 0, maxX: 4, maxY: 1 });
});

test("clearMarqueeSelection clears the C marquee on the action and construction", () => {
  const construction = { marqueeActive: true, marqueeToggle: true };
  installSandkit({
    action: { customData: { marqueeSelected: true, mode: 2, start: { x: 1, y: 1 } } },
    construction,
  });
  let customData: unknown;
  let helper: unknown;
  const api = {
    action: {
      setCustomData: (value: unknown) => {
        customData = value;
      },
    },
    ui: {
      update: (id: unknown) => {
        helper = id;
      },
    },
  };
  clearMarqueeSelection(api as SandkitApi);
  assert.deepEqual(customData, {
    marqueeSelected: false,
    mode: 0,
    start: undefined,
    end: undefined,
    selectedStructures: [],
    mouseOffset: undefined,
  });
  assert.equal(construction.marqueeActive, false);
  assert.equal(construction.marqueeToggle, false);
  assert.equal(helper, 1);
});
