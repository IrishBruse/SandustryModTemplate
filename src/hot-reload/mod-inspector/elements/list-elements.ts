import { elementTypeName, isBuiltInElementType } from "./element-type-name";
import {
  elementSourceKind,
  externalModIdSet,
  modIdFromRegistryEntry,
  type ElementSourceKind,
} from "../mod-source";
import { matterLabel } from "./matter-labels";
import type { Rgb } from "./element-colors";

const api = sandkit.api;

export type ElementRow = {
  elementType: number;
  typeName: string;
  id: string;
  name: string;
  nameKey: string | null;
  descriptionKey: string | null;
  matterType: number;
  matterLabel: string;
  density: number;
  collectorValue: number;
  source: ElementSourceKind;
  modId: string | null;
  backgroundCss: string;
  textColor: string;
  variantCount: number;
  metaColorHex: string | null;
  materialId: number | null;
  hidden: boolean | null;
  isGrabbable: boolean | null;
  isTransportable: boolean | null;
  duration: number | null;
  durationRandom: string | null;
  horizontalSpeed: number | null;
  defaultDataFields: string[];
  extraProps: string[];
  flammable: string | null;
  mixes: string[];
  interactions: string[];
  description: string | null;
};

type LiveDefinition = ReturnType<typeof api.elements.getDefinitionByType> & {
  description?: string;
  descriptionKey?: string;
  metaColor?: number;
  materialId?: number;
  hidden?: boolean;
  isGrabbable?: boolean;
  isTransportable?: boolean;
  duration?: number;
  durationRandom?: { min?: number; max?: number };
  horizontalSpeed?: number;
  flammable?: {
    outputElementId?: string;
    outputChance?: number;
    fireInheritsDuration?: boolean;
    duration?: [number, number] | number[];
  };
  collectable?: { value?: number };
  mixes?: readonly { elementType?: number; result?: number }[];
  interactions?: readonly { kind?: string }[];
  getExtraProps?: () => { data?: Record<string, unknown> };
};

type ModElementEntry = {
  elementType?: number;
  id?: string;
  metaColor?: number;
  interactions?: readonly { kind?: string }[];
};

const ET = sandkit.enums.ElementType;

/** Built-in type → canonical string id (from i18n nameKey). */
const VANILLA_ID_BY_TYPE: Record<number, string> = {
  [ET.Sand]: "sand",
  [ET.Particle]: "particle",
  [ET.Water]: "water",
  [ET.WetSand]: "wetSand",
  [ET.Sandium]: "sandium",
  [ET.Residue]: "residue",
  [ET.Gold]: "gold",
  [ET.Gloom]: "gloom",
  [ET.Shake]: "shake",
  [ET.Steam]: "steam",
  [ET.Fire]: "fire",
  [ET.FreezingIce]: "freezingIce",
  [ET.Flame]: "flame",
  [ET.BurntResidue]: "burntResidue",
  [ET.Seed]: "seed",
  [ET.WetSeed]: "wetSeed",
  [ET.Seedling]: "seedling",
  [ET.Petalium]: "petalium",
  [ET.Lava]: "lava",
  [ET.Basalt]: "basalt",
};

function modElementsMap(): Map<number, ModElementEntry> {
  const out = new Map<number, ModElementEntry>();
  try {
    const mods = (
      sandkit.engine?.state as {
        sandkit?: { mods?: { elements?: Record<string, ModElementEntry> } };
      }
    )?.sandkit?.mods?.elements;
    if (!mods) return out;
    for (const entry of Object.values(mods)) {
      if (typeof entry?.elementType === "number") out.set(entry.elementType, entry);
    }
  } catch {
    /* ignore */
  }
  return out;
}

function modIdForType(type: number, modMap: Map<number, ModElementEntry>): string | null {
  return modIdFromRegistryEntry(modMap.get(type));
}

function pickBackground(
  definition: ReturnType<typeof api.elements.getDefinitionByType>,
  modEntry: ModElementEntry | undefined,
): { backgroundCss: string; rgb: Rgb | null } {
  const variant = definition?.colors?.variants?.[0];
  if (variant && variant.length >= 3) {
    const rgb: Rgb = [variant[0]!, variant[1]!, variant[2]!];
    return { backgroundCss: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`, rgb };
  }
  if (typeof modEntry?.metaColor === "number") {
    const c = modEntry.metaColor;
    const rgb: Rgb = [(c >> 16) & 0xff, (c >> 8) & 0xff, c & 0xff];
    return { backgroundCss: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`, rgb };
  }
  return { backgroundCss: "rgb(71, 85, 105)", rgb: [71, 85, 105] };
}

function interactionLabels(raw: readonly { kind?: string }[] | undefined): string[] {
  if (!raw?.length) return [];
  const out: string[] = [];
  for (const item of raw) {
    if (item.kind) out.push(item.kind);
  }
  return out;
}

function hexFromMetaColor(value: unknown): string | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return `#${(value >>> 0).toString(16).padStart(6, "0")}`;
}

function formatRange(min: unknown, max: unknown): string | null {
  if (typeof min !== "number" || typeof max !== "number") return null;
  return `${min}–${max}`;
}

function extraPropLabels(definition: LiveDefinition | undefined): string[] {
  if (typeof definition?.getExtraProps !== "function") return [];
  try {
    const data = definition.getExtraProps()?.data;
    if (!data) return [];
    return Object.entries(data).map(([key, value]) => `${key}=${String(value)}`);
  } catch {
    return [];
  }
}

function flammableLabel(raw: LiveDefinition["flammable"] | undefined): string | null {
  if (!raw || typeof raw !== "object") return null;
  const parts: string[] = [];
  if (raw.outputElementId) {
    const chance =
      typeof raw.outputChance === "number" ? ` ${Math.round(raw.outputChance * 100)}%` : "";
    parts.push(`→ ${raw.outputElementId}${chance}`);
  }
  if (Array.isArray(raw.duration) && raw.duration.length >= 2) {
    parts.push(`fire ${raw.duration[0]}–${raw.duration[1]}`);
  }
  if (raw.fireInheritsDuration) parts.push("inherits duration");
  return parts.length > 0 ? parts.join(" · ") : "yes";
}

function mixLabels(raw: LiveDefinition["mixes"] | undefined): string[] {
  if (!raw?.length) return [];
  return raw
    .filter((item) => typeof item.elementType === "number" && typeof item.result === "number")
    .map((item) => `${item.elementType} → ${item.result}`);
}

function dataFieldLabels(fields: Record<string, number> | undefined): string[] {
  if (!fields) return [];
  return Object.entries(fields).map(([key, value]) => `${key}=${value}`);
}

function lexiconDescription(elementId: string): string | null {
  try {
    const lexicon = (
      sandkit.engine?.state as {
        session?: {
          lexicon?: {
            entriesById?: Record<string, { kind?: string; description?: string }>;
          };
        };
      }
    )?.session?.lexicon;
    const entry = lexicon?.entriesById?.[elementId];
    if (entry?.kind === "element" && entry.description) return entry.description;
  } catch {
    /* ignore */
  }
  return null;
}

function canonicalElementId(
  elementType: number,
  definition: ReturnType<typeof api.elements.getDefinitionByType>,
  modEntry: ModElementEntry | undefined,
): string {
  if (definition?.id) return definition.id;
  const fromType = VANILLA_ID_BY_TYPE[elementType];
  if (fromType) return fromType;
  const nameKey = definition?.nameKey;
  if (nameKey) {
    const match = /^elements\|([^|]+)\|/.exec(nameKey);
    if (match) return match[1]!;
  }
  if (modEntry?.id) {
    const colon = modEntry.id.indexOf(":");
    return colon >= 0 ? modEntry.id.slice(colon + 1) : modEntry.id;
  }
  return String(elementType);
}

/** All registered elements with display fields for the inspector grid. */
export function listElements(): ElementRow[] {
  try {
    const types = api.elements.getRegisteredTypes();
    const modMap = modElementsMap();
    const externalModIds = externalModIdSet();
    const rows: ElementRow[] = [];

    for (const elementType of types) {
      const definition = api.elements.getDefinitionByType(elementType) as
        | LiveDefinition
        | undefined;
      const modEntry = modMap.get(elementType);
      const id = canonicalElementId(elementType, definition, modEntry);
      const source = elementSourceKind(elementType, modEntry, externalModIds, isBuiltInElementType);
      const rawName = api.elements.getNameByType(elementType);
      const name =
        !rawName || /^\d+$/.test(rawName) || rawName.startsWith("[")
          ? id.charAt(0).toUpperCase() + id.slice(1)
          : rawName;
      const { backgroundCss, rgb } = pickBackground(definition, modEntry);
      const textColor =
        rgb && (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255 > 140
          ? "#1a1a1a"
          : "#f8fafc";
      const matterType = definition?.matterType ?? 0;

      rows.push({
        elementType,
        typeName: elementTypeName(elementType, id),
        id,
        name,
        nameKey: definition?.nameKey ?? null,
        descriptionKey: definition?.descriptionKey ?? null,
        matterType,
        matterLabel: matterType ? matterLabel(matterType) : "—",
        density: definition?.density ?? 0,
        collectorValue: definition?.collectable?.value ?? safeCollectorValue(elementType),
        source,
        modId: source === "mod" ? modIdForType(elementType, modMap) : null,
        backgroundCss,
        textColor,
        variantCount: definition?.colors?.variants?.length ?? 0,
        metaColorHex: hexFromMetaColor(definition?.metaColor ?? modEntry?.metaColor),
        materialId: typeof definition?.materialId === "number" ? definition.materialId : null,
        hidden: typeof definition?.hidden === "boolean" ? definition.hidden : null,
        isGrabbable: typeof definition?.isGrabbable === "boolean" ? definition.isGrabbable : null,
        isTransportable:
          typeof definition?.isTransportable === "boolean" ? definition.isTransportable : null,
        duration: typeof definition?.duration === "number" ? definition.duration : null,
        durationRandom: formatRange(
          definition?.durationRandom?.min,
          definition?.durationRandom?.max,
        ),
        horizontalSpeed:
          typeof definition?.horizontalSpeed === "number" ? definition.horizontalSpeed : null,
        defaultDataFields: dataFieldLabels(definition?.defaultDataFields),
        extraProps: extraPropLabels(definition),
        flammable: flammableLabel(definition?.flammable),
        mixes: mixLabels(definition?.mixes),
        interactions: interactionLabels(definition?.interactions ?? modEntry?.interactions),
        description: definition?.description ?? lexiconDescription(id),
      });
    }

    return rows.sort((a, b) => a.elementType - b.elementType);
  } catch {
    return [];
  }
}

function safeCollectorValue(elementType: number): number {
  try {
    return api.collector.getValueByType(elementType);
  } catch {
    return 0;
  }
}

export function elementByType(rows: ElementRow[], type: number): ElementRow | undefined {
  return rows.find((row) => row.elementType === type);
}
