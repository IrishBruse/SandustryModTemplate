import { inGame, safe } from "@modkit/utils";
import {
  buildCopiedStructure,
  normalizeFilterElementType,
  type StructureAtCell,
  type StructureConfigLite,
  type StructureFilter,
} from "./copied-structure";
import { collectStructureTypeKeys, resolvePickStructureType } from "./resolve-type";

const api = sandkit.api;
const { ComponentId, StructureType } = sandkit.enums;

export const PICKER_BINDING_ID = "Picker";

const FOUNDATION_PICK_TYPES = new Set<number>([
  StructureType.Foundation,
  StructureType.FoundationAngledLeft,
  StructureType.FoundationAngledRight,
  StructureType.FoundationTriangleLeftDel,
  StructureType.FoundationTriangleRightDel,
]);

const FILTER_MK2_IDS = new Set(["filterRightMk2", "filterLeftMk2"]);

type BuildingSession = {
  activeStructureType?: string | number | null;
  placing?: boolean;
};

type ActionSession = {
  customData?: { copiedStructure?: unknown } | null;
};

type PlayerStore = {
  action?: unknown;
  hotbar?: { activeSlotIndex?: number | null };
};

type OptionsStore = {
  defaultFilter?: Record<string, unknown>;
};

type PickBlockState = {
  session: {
    building: BuildingSession;
    action: ActionSession;
  };
  store: {
    player: PlayerStore;
    options: OptionsStore;
  };
};

function pickBlockState(): PickBlockState {
  return sandkit.state as PickBlockState;
}

function structureConfig(type: string | number): StructureConfigLite | undefined {
  const fromApi = api.structures.getDefinitionByType(type);
  if (fromApi) return fromApi as StructureConfigLite;

  const engine = sandkit.engine.api.structures as {
    getConfig?: (candidate: string | number) => StructureConfigLite | undefined;
  };
  return engine.getConfig?.(type);
}

function structureTypeKeys(): (string | number)[] {
  return collectStructureTypeKeys(Object.values(StructureType), api.structures.getUnlockedTypes());
}

function structureAtCell(x: number, y: number): StructureAtCell | null {
  const structure = api.structures.getAtCell(x, y);
  if (!structure || typeof structure !== "object") return null;

  const typed = structure as unknown as StructureAtCell;
  if (typed.type === undefined || typed.type === null) return null;
  return typed;
}

function isFilterPickType(resolvedType: string | number): boolean {
  if (FILTER_MK2_IDS.has(String(resolvedType))) return true;
  return resolvedType === StructureType.FilterLeft || resolvedType === StructureType.FilterRight;
}

function applyDefaultFilter(resolvedType: string | number, filter: StructureFilter | undefined) {
  if (filter?.elementType == null) return;
  if (!isFilterPickType(resolvedType)) return;

  const mk2 = FILTER_MK2_IDS.has(String(resolvedType));
  const elementType =
    mk2 && Array.isArray(filter.elementType)
      ? [...filter.elementType]
      : normalizeFilterElementType(filter.elementType);

  pickBlockState().store.options.defaultFilter = {
    elementType,
    mode: filter.mode || "allow",
    ...(filter.affectsLiquid ? { affectsLiquid: true } : {}),
    ...(filter.affectsGas ? { affectsGas: true } : {}),
  };
}

function applyFoundationColor(color: unknown) {
  const stored =
    color === undefined || color === null ? null : (color as string | number | boolean);
  api.storage.set("foundationColorPicker", "color", stored);
  api.ui.overlays.update("hotbar");
}

function applyLightColor(color: unknown) {
  const colorPicker = sandkit.engine.api.colorPicker as {
    hexToRgba?: (value: unknown) => unknown;
  };
  if (!colorPicker?.hexToRgba || color == null) return;

  const rgba = colorPicker.hexToRgba(color);
  if (rgba === undefined || rgba === null) return;
  api.storage.set("lightColorPicker", "color", rgba as string | number | boolean);
  api.ui.overlays.update("hotbar");
}

function structureDisplayName(config: StructureConfigLite | undefined): string {
  if (!config) return api.i18n.t("mods|shortcuts|structureFallback");
  return api.i18n.getName(config);
}

export function pickBlockAtMouse(): void {
  if (!inGame()) return;
  if (api.tools.grabber.isLoaded()) return;

  const cell = api.input.getMouseCellPosition();
  const structure = structureAtCell(cell.x, cell.y);
  if (!structure) {
    api.ui.toast({ key: "mods|shortcuts|noStructureToPick" }, {});
    return;
  }

  const sourceConfig = structureConfig(structure.type);
  if (sourceConfig?.disallowPick) {
    api.ui.toast({ key: "mods|shortcuts|cannotPickStructure" }, {});
    return;
  }

  const resolvedType = resolvePickStructureType(
    structure.type,
    structureConfig,
    structureTypeKeys(),
  );
  const copiedStructure = buildCopiedStructure(structure, sourceConfig);
  const state = pickBlockState();

  state.session.building.activeStructureType = resolvedType;
  state.session.building.placing = false;
  state.store.player.action = null;
  if (state.store.player.hotbar) {
    state.store.player.hotbar.activeSlotIndex = null;
  }
  api.action.setCustomData({ copiedStructure });

  if (typeof resolvedType === "number" && FOUNDATION_PICK_TYPES.has(resolvedType)) {
    applyFoundationColor(structure.color ?? null);
  } else if (resolvedType === StructureType.Light) {
    applyLightColor(structure.color);
  }

  applyDefaultFilter(resolvedType, structure.filter);

  api.input.resetMouseState();
  api.ui.update(ComponentId.Hotbar);
  api.ui.update(ComponentId.ShortcutHelper);
  api.ui.update(ComponentId.FilterConfig);

  const pickedConfig = structureConfig(resolvedType);
  api.ui.toast(
    {
      key: "mods|shortcuts|picked",
      params: { name: structureDisplayName(pickedConfig) },
    },
    {},
  );
}

export function installInstantPickBlock(): void {
  const keys = api.input.getBoundKeys(PICKER_BINDING_ID);
  api.input.registerBinding(PICKER_BINDING_ID, keys.length > 0 ? keys : ["KeyF"], {
    displayName: "Pick Block",
    displayNameKey: "mods|shortcuts|pickBlock",
    category: "hotbar",
    handlers: {
      down: () => {
        safe(() => pickBlockAtMouse());
      },
    },
  });
}
