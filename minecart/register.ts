import { safe } from "@modkit/utils";
import { CELL_PX, TILE_CELLS } from "./constants.ts";
import { CART_ITEM, SPRITE, STRUCTURE } from "./ids.ts";
import { spawnCartAtCell } from "./runtime.ts";

const api = sandkit.api;
const BUILDING_CATEGORY_KEY = "irishbruse.minecart.category";

export function registerI18n(): void {
  api.i18n.register("en", {
    [`${STRUCTURE.rail}.name`]: "Minecart Rail",
    [`${STRUCTURE.rail}.desc`]:
      "Drag a line for flat track. Drag diagonally for an incline. Carts stay upright.",
    [`${STRUCTURE.rampRiseRight}.name`]: "Minecart Rail (incline)",
    [`${STRUCTURE.rampRiseRight}.desc`]:
      "Inclined rail. Place with a diagonal drag of Minecart Rail.",
    [`${STRUCTURE.rampRiseLeft}.name`]: "Minecart Rail (incline)",
    [`${STRUCTURE.rampRiseLeft}.desc`]:
      "Inclined rail. Place with a diagonal drag of Minecart Rail.",
    [`${STRUCTURE.loader}.name`]: "Minecart Loader",
    [`${STRUCTURE.loader}.desc`]:
      "Hopper above the rail. Vacuums powder and liquid into a cart on the rail below.",
    [`${STRUCTURE.unloader}.name`]: "Minecart Unloader",
    [`${STRUCTURE.unloader}.desc`]:
      "Solid dump pad under the rail. Place it under the cart. Cargo drops out the bottom onto belts.",
    [`${CART_ITEM}.name`]: "Minecart",
    [`${CART_ITEM}.desc`]: "Click a rail to place a cart. Demolish (X) a cart to remove it.",
    [BUILDING_CATEGORY_KEY]: "Minecarts",
  });
}

function stampRender(imageName: string, outline = true) {
  const span = TILE_CELLS * CELL_PX;
  return {
    imageName,
    size: { width: span, height: span },
    offset: { x: 0, y: 0 },
    ui: { outline },
  };
}

function hideInclineVariants(): void {
  const mods = (
    sandkit.state as {
      sandkit?: { mods?: { structures?: Record<string, Record<string, unknown>> } };
      store?: { player?: { buildings?: unknown[] } };
    }
  ).sandkit?.mods?.structures;
  const buildings = (sandkit.state as { store?: { player?: { buildings?: unknown[] } } }).store
    ?.player?.buildings;

  for (const id of [STRUCTURE.rampRiseRight, STRUCTURE.rampRiseLeft]) {
    const def = mods?.[id];
    if (def) {
      delete def.order;
      delete def.buildModes;
      delete def.categoryKey;
      delete def.nameKey;
      delete def.descriptionKey;
    }
    if (Array.isArray(buildings)) {
      for (let i = buildings.length - 1; i >= 0; i -= 1) {
        if (buildings[i] === id) buildings.splice(i, 1);
      }
    }
  }
}

function stampShape(cellType: number): number[][] {
  return Array.from({ length: TILE_CELLS }, () =>
    Array.from({ length: TILE_CELLS }, () => cellType),
  );
}

/**
 * Hopper footprint for `useRawShape`. `Block` only on the rim and spout pad.
 * Funnel cells stay `Empty` so foundation Block (red) never shows through —
 * same idea as rails, which omit terrain entirely.
 */
function loaderShape(): number[][] {
  const B = sandkit.enums.CellType.Block;
  const E = sandkit.enums.CellType.Empty;
  return [
    [B, B, B, B],
    [E, E, E, E],
    [E, E, E, E],
    [E, B, B, E],
  ];
}

function registerStructures(): void {
  const categoryKey = api.i18n.t(BUILDING_CATEGORY_KEY);
  const solid = stampShape(sandkit.enums.CellType.Block);
  const line = { type: "line", directions: ["horizontal", "diagonal"] };
  const raw = { useRawShape: true };

  api.structures.register(
    {
      id: STRUCTURE.rail,
      nameKey: `${STRUCTURE.rail}.name`,
      descriptionKey: `${STRUCTURE.rail}.desc`,
      categoryKey,
      order: 10,
      buildModes: [line],
      render: stampRender(SPRITE.rail, false),
    },
    raw,
  );

  api.structures.register(
    {
      id: STRUCTURE.rampRiseRight,
      render: stampRender(SPRITE.rampRiseRight, false),
    },
    raw,
  );

  api.structures.register(
    {
      id: STRUCTURE.rampRiseLeft,
      render: stampRender(SPRITE.rampRiseLeft, false),
    },
    raw,
  );

  // Line lock uses signed degrees. Filter also keeps 0-360: 315 ≡ -45, 225 ≡ -135.
  api.structures.registerVariant(STRUCTURE.rail, { id: STRUCTURE.rail, angles: [0, 180, -180] });
  api.structures.registerVariant(STRUCTURE.rail, {
    id: STRUCTURE.rampRiseRight,
    angles: [-45, 135, 315],
  });
  api.structures.registerVariant(STRUCTURE.rail, {
    id: STRUCTURE.rampRiseLeft,
    angles: [45, -135, 225],
  });

  hideInclineVariants();

  api.structures.register(
    {
      id: STRUCTURE.loader,
      nameKey: `${STRUCTURE.loader}.name`,
      descriptionKey: `${STRUCTURE.loader}.desc`,
      categoryKey,
      order: 14,
      buildModes: [{ type: "rectangle" }],
      variants: [{ id: STRUCTURE.loader, angles: [0] }],
      shape: loaderShape(),
      render: stampRender(SPRITE.loader),
    },
    raw,
  );

  api.structures.register(
    {
      id: STRUCTURE.unloader,
      nameKey: `${STRUCTURE.unloader}.name`,
      descriptionKey: `${STRUCTURE.unloader}.desc`,
      categoryKey,
      order: 15,
      buildModes: [{ type: "rectangle" }],
      variants: [{ id: STRUCTURE.unloader, angles: [0] }],
      shape: solid,
      render: stampRender(SPRITE.unloader),
    },
    raw,
  );
}

function playerInventory(): { id?: string }[] | null {
  const inv = (sandkit.state as { store?: { player?: { inventory?: unknown } } }).store?.player
    ?.inventory;
  return Array.isArray(inv) ? (inv as { id?: string }[]) : null;
}

function ensureOneCartInInventory(): void {
  const inv = playerInventory();
  if (!inv) {
    safe(() => api.player.inventory.addById(CART_ITEM));
    return;
  }
  let keep = -1;
  for (let i = 0; i < inv.length; i += 1) {
    if (inv[i]?.id !== CART_ITEM) continue;
    if (keep < 0) {
      keep = i;
      continue;
    }
    inv.splice(i, 1);
    i -= 1;
  }
  if (keep < 0) safe(() => api.player.inventory.addById(CART_ITEM));
}

function registerCartItem(): void {
  const definition = {
    id: CART_ITEM,
    nameKey: `${CART_ITEM}.name`,
    descriptionKey: `${CART_ITEM}.desc`,
    categoryKey: "construction",
    itemType: sandkit.enums.ItemType.Tool,
    sprite: {
      id: SPRITE.cart,
      type: "onehand",
      ui: { imageName: SPRITE.cartIcon },
    },
    handleAction: (state: unknown) => {
      const session = (
        state as {
          session?: {
            action?: { state?: Record<number, boolean> };
            input?: { mouse?: { cellPosition?: { x: number; y: number }; clicked?: boolean } };
          };
        }
      ).session;
      const start = sandkit.enums.ActionState.Start;
      const clicked = session?.input?.mouse?.clicked === true;
      if (!session?.action?.state?.[start] && !clicked) return;
      const cell = session?.input?.mouse?.cellPosition;
      if (!cell) return;
      spawnCartAtCell(cell.x, cell.y);
    },
  };
  if (api.items.getDefinitionById(CART_ITEM)) {
    safe(() => api.items.updateDefinition(CART_ITEM, definition));
  } else {
    safe(() => api.items.register(definition));
  }
  ensureOneCartInInventory();
}

export function registerContent(): void {
  registerI18n();

  const loads = [
    [SPRITE.rail, "rail.png"],
    [SPRITE.rampRiseRight, "ramp-rise-right.png"],
    [SPRITE.rampRiseLeft, "ramp-rise-left.png"],
    [SPRITE.loader, "loader.png"],
    [SPRITE.unloader, "unloader.png"],
    [SPRITE.cart, "cart.png"],
    [SPRITE.cartIcon, "cart-icon.png"],
  ] as const;

  void Promise.all(loads.map(([id, file]) => api.sprites.loadFromMod(id, file))).then(() => {
    registerStructures();
    registerCartItem();
    unlockContent();
  });
}

export function unlockContent(): void {
  for (const id of [STRUCTURE.rail, STRUCTURE.loader, STRUCTURE.unloader]) {
    api.player.buildings.unlockById(id);
  }
  hideInclineVariants();
}
