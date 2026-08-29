/** Icons and labels for reaction chain steps. */

export type ReactionKind = "contact-mix" | "element-mix" | "machine" | "burn" | "structure";

/** Tech-tree palette from Research (`test.html`). */
export const KIND_COLOR: Record<ReactionKind, string> = {
  "contact-mix": "#0088ff",
  "element-mix": "#00ff00",
  machine: "#ff8800",
  burn: "#ff3500",
  structure: "#D459C2",
};

export const KIND_LABEL: Record<ReactionKind, string> = {
  "contact-mix": "Contact",
  "element-mix": "Element mix",
  machine: "Machine",
  burn: "Burn",
  structure: "Structure",
};

/** Recipe bag / alias → structure id used for icons. */
export const MACHINE_ICON_ID: Record<string, string> = {
  condensers: "thermofroster",
  condenser: "thermofroster",
  thermofroster: "thermofroster",
  steamDryers: "thermodryer",
  steamDryer: "thermodryer",
  thermodryer: "thermodryer",
  synthesizers: "aurixiteCrystallizer",
  synthesizer: "aurixiteCrystallizer",
  aurixiteCrystallizer: "aurixiteCrystallizer",
  snowmakers: "snowmaker",
  snowmaker: "snowmaker",
  smelters: "smelter",
  smelter: "smelter",
  shakers: "shaker",
  shaker: "shaker",
  growers: "grower",
  grower: "grower",
  planterBox: "grower",
  kineticPresses: "velocitySoaker",
  kineticPress: "velocitySoaker",
  velocitySoaker: "velocitySoaker",
  copperMold: "copperMold",
  anvil: "anvil",
};

/**
 * Vanilla / known assets when `api.sprites.getById` has no entry
 * (Research tech tree paths under `dist/`).
 */
export const ASSET_FALLBACK: Record<string, string> = {
  shaker: "img/shaker_right.png",
  grower: "img/farm.png",
  velocitySoaker: "img/velocity.png",
  kineticPress: "img/velocity.png",
  burn: "img/flamethrower_icon.png",
};

/** Map structure interaction refs onto machine recipe bags when possible. */
export const STRUCTURE_MACHINE: Record<string, { bag: string; label: string }> = {
  thermofroster: { bag: "condensers", label: "Condenser" },
  condenser: { bag: "condensers", label: "Condenser" },
  thermodryer: { bag: "steamDryers", label: "Steam Dryer" },
  steamDryer: { bag: "steamDryers", label: "Steam Dryer" },
  aurixiteCrystallizer: { bag: "synthesizers", label: "Synthesizer" },
  synthesizer: { bag: "synthesizers", label: "Synthesizer" },
  snowmaker: { bag: "snowmakers", label: "Snowmaker" },
  smelter: { bag: "smelters", label: "Smelter" },
  shaker: { bag: "shakers", label: "Shaker" },
  grower: { bag: "growers", label: "Planter Box" },
  velocitySoaker: { bag: "kineticPresses", label: "Kinetic Press" },
  kineticPress: { bag: "kineticPresses", label: "Kinetic Press" },
};

function gameDistBase(): string {
  try {
    return String(location.href).replace(/index\.html.*$/i, "");
  } catch {
    return "";
  }
}

export function assetUrl(rel: string): string {
  return `${gameDistBase()}${rel.replace(/^\//, "")}`;
}

function spriteSrc(imageName: string | null | undefined): string | null {
  if (!imageName) return null;
  try {
    const spr = sandkit.api.sprites.getById(imageName) as
      | { imageAsset?: { image?: { src?: string } } }
      | null
      | undefined;
    const src = spr?.imageAsset?.image?.src;
    if (typeof src === "string" && src) return src;
  } catch {
    /* ignore */
  }
  return null;
}

export function structureIconSrc(ref: string | number): string | null {
  const alias = typeof ref === "string" ? (MACHINE_ICON_ID[ref] ?? ref) : ref;
  try {
    const type =
      typeof alias === "string"
        ? (sandkit.api.structures.getTypeById(alias) ?? alias)
        : alias;
    const def = sandkit.api.structures.getDefinitionByType(type);
    const fromSprite = spriteSrc(def?.render?.imageName);
    if (fromSprite) return fromSprite;
  } catch {
    /* ignore */
  }

  const key = typeof alias === "string" ? alias : "";
  if (key && ASSET_FALLBACK[key]) return assetUrl(ASSET_FALLBACK[key]!);

  if (typeof alias === "string" && alias) {
    const fromMods = spriteSrc(alias);
    if (fromMods) return fromMods;
  }
  return null;
}

export function machineIconSrc(machineId: string): string | null {
  const mapped = MACHINE_ICON_ID[machineId] ?? machineId;
  return structureIconSrc(mapped);
}

export function burnIconSrc(): string {
  return assetUrl(ASSET_FALLBACK.burn!);
}

export function structureLabel(ref: string | number): string {
  try {
    if (typeof ref === "number") {
      const def = sandkit.api.structures.getDefinitionByType(ref);
      const key = def?.nameKey;
      if (typeof key === "string" && key) {
        try {
          const text = sandkit.api.i18n.t(key);
          if (typeof text === "string" && text && text !== key) return text;
        } catch {
          /* ignore */
        }
        const match = /^structures\|([^|]+)\|/.exec(key);
        if (match) return titleCase(match[1]!);
      }
      return `structure ${ref}`;
    }
    const mapped = STRUCTURE_MACHINE[ref];
    if (mapped) return mapped.label;
    const type = sandkit.api.structures.getTypeById(ref);
    if (type != null) {
      const def = sandkit.api.structures.getDefinitionByType(type);
      if (typeof def?.name === "string" && def.name && def.name !== ref) return def.name;
      if (typeof def?.nameKey === "string") {
        try {
          const text = sandkit.api.i18n.t(def.nameKey);
          if (typeof text === "string" && text && text !== def.nameKey) return text;
        } catch {
          /* ignore */
        }
      }
    }
    return titleCase(ref);
  } catch {
    return String(ref);
  }
}

function titleCase(id: string): string {
  return id
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}
