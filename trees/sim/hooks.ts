import { ELEMENT, TERRAIN, VANILLA_ELEMENT } from "../elements/ids.ts";
import { burnRawWood } from "./burn.ts";
import { cellFromArgs } from "./cell.ts";
import { collapseIfUnsupported, collapseTrunkFromDestroyed } from "./collapse.ts";
import { growPineShoot } from "./growth.ts";
import { breakPineNeedle, compostLeafDust } from "./needles.ts";
import {
  plantPineSeedFromBlocked,
  plantPineSeedFromMove,
  plantPineSeedFromUpdate,
} from "./planting.ts";
import type { TreeTypes } from "./types.ts";

function resolveTypes(api: WorkerSandkitApi): TreeTypes {
  const ElementType = sandkit.enums.ElementType;
  return {
    pineSeed: api.elements.getTypeById(ELEMENT.pineSeed),
    pineShoot: api.elements.getTypeById(ELEMENT.pineShoot),
    pineWood: api.terrains.getTypeById(TERRAIN.pineWood),
    pineNeedle: api.elements.getTypeById(ELEMENT.pineNeedle),
    rawWood: api.elements.getTypeById(ELEMENT.rawWood),
    charcoal: api.elements.getTypeById(ELEMENT.charcoal),
    leafDust: api.elements.getTypeById(ELEMENT.leafDust),
    wetSand: api.elements.getTypeById(VANILLA_ELEMENT.wetSand),
    sand: api.elements.getTypeById(VANILLA_ELEMENT.sand),
    fire: ElementType.Fire,
    flame: ElementType.Flame,
  };
}

function destroyedCell(payload: unknown): { x: number; y: number; cellType: number } | null {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  const x = typeof record.cellX === "number" ? record.cellX : record.x;
  const y = typeof record.cellY === "number" ? record.cellY : record.y;
  const cellType = record.cellType;
  if (typeof x !== "number" || typeof y !== "number" || typeof cellType !== "number") return null;
  return { x, y, cellType };
}

function onShootUpdate(
  api: WorkerSandkitApi,
  types: TreeTypes,
  args: Record<string, unknown>,
): void {
  const cell = cellFromArgs(args);
  if (!cell) return;
  collapseIfUnsupported(api, types, cell.x, cell.y, types.pineShoot);
}

function onNeedleUpdate(
  api: WorkerSandkitApi,
  types: TreeTypes,
  args: Record<string, unknown>,
): void {
  const cell = cellFromArgs(args);
  if (!cell) return;
  collapseIfUnsupported(api, types, cell.x, cell.y, types.pineNeedle);
  if (!api.elements.isTypeAtCell(cell.x, cell.y, types.pineNeedle)) return;
  breakPineNeedle(api, types, cell.x, cell.y);
}

function onShootDuration(
  api: WorkerSandkitApi,
  types: TreeTypes,
  args: Record<string, unknown>,
  context: { cancel(): void },
): void {
  const cell = cellFromArgs(args);
  if (!cell) return;
  growPineShoot(api, types, cell.x, cell.y);
  context.cancel();
}

export function registerSimHooks(api: WorkerSandkitApi): void {
  const types = resolveTypes(api);

  api.hooks.intercept(
    "element:blocked",
    (args, context) => {
      plantPineSeedFromBlocked(api, types, args, context);
    },
    { guard: { elementType: types.pineSeed } },
  );

  api.hooks.intercept("element:move", (args, context) => {
    const record = args as Record<string, unknown>;
    if (record.elementType !== types.pineSeed) return;
    plantPineSeedFromMove(api, types, record, context);
  });

  api.hooks.intercept(
    "element:update",
    (args) => {
      plantPineSeedFromUpdate(api, types, args);
    },
    { guard: { elementType: types.pineSeed } },
  );

  api.hooks.intercept(
    "element:update",
    (args) => {
      onShootUpdate(api, types, args);
    },
    { guard: { elementType: types.pineShoot } },
  );

  api.hooks.intercept(
    "element:duration",
    (args, context) => {
      onShootDuration(api, types, args, context);
    },
    { guard: { elementType: types.pineShoot } },
  );

  api.hooks.intercept(
    "element:duration:expire",
    (args, context) => {
      onShootDuration(api, types, args, context);
    },
    { guard: { elementType: types.pineShoot } },
  );

  api.hooks.intercept(
    "element:update",
    (args) => {
      onNeedleUpdate(api, types, args);
    },
    { guard: { elementType: types.pineNeedle } },
  );

  api.hooks.intercept(
    "element:update",
    (args) => {
      const cell = cellFromArgs(args);
      if (!cell) return;
      compostLeafDust(api, cell.x, cell.y);
    },
    { guard: { elementType: types.leafDust } },
  );

  api.hooks.intercept("fire:element:burn", (args, context) => {
    const record = args as Record<string, unknown>;
    if (record.elementType !== types.rawWood) return;
    const cell = cellFromArgs(record);
    if (!cell) return;
    burnRawWood(api, types, cell.x, cell.y, context);
  });

  try {
    api.events.on("terrain:destroyed", (payload) => {
      const cell = destroyedCell(payload);
      if (!cell || cell.cellType !== types.pineWood) return;
      collapseTrunkFromDestroyed(api, types, cell.x, cell.y);
    });
  } catch {
    /* Main-thread terrain:destroyed harvest still runs. */
  }
}
