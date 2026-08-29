/**
 * Vanilla recipes that are not in `mods.recipes` — scraped live from the game
 * `js/bundle.js` (locale structure descriptions + engine contact/burn tables).
 */

import { STRUCTURE_MACHINE } from "./step-icons.ts";
export type LiveContact = { inputs: [string, string]; outputs: string[] };
export type LiveBurn = { input: string; output: string; chance: number };
export type LiveMachine = {
  machineId: string;
  label: string;
  input: string;
  outputs: { id: string; chance?: number }[];
};

export type LiveEngineRecipes = {
  contacts: LiveContact[];
  burns: LiveBurn[];
  machines: LiveMachine[];
};

const EMPTY: LiveEngineRecipes = { contacts: [], burns: [], machines: [] };

let cache: LiveEngineRecipes | null = null;
let inflight: Promise<LiveEngineRecipes> | null = null;

/** Cached scrape, or null before the first successful load. */
export function getCachedLiveEngineRecipes(): LiveEngineRecipes | null {
  return cache;
}

/** Drop cache so the next load re-fetches the game bundle. */
export function clearLiveEngineRecipesCache(): void {
  cache = null;
  inflight = null;
}

/** Fetch + parse once; later calls reuse the cache. */
export async function loadLiveEngineRecipes(force = false): Promise<LiveEngineRecipes> {
  if (!force && cache) return cache;
  if (!force && inflight) return inflight;
  inflight = (async () => {
    try {
      const text = await fetchGameBundle();
      const parsed = parseLiveEngineRecipes(text);
      cache = parsed;
      return parsed;
    } catch {
      cache = EMPTY;
      return EMPTY;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

function fetchGameBundle(): Promise<string> {
  const base = String(location.href).replace(/index\.html.*$/i, "");
  return fetch(`${base}js/bundle.js`).then((res) => {
    if (!res.ok) throw new Error(`bundle ${res.status}`);
    return res.text();
  });
}

/** Pure parser — unit-tested with bundle snippets. */
export function parseLiveEngineRecipes(bundle: string): LiveEngineRecipes {
  const shakerGoldChance = parseShakerGoldChance(bundle);
  return {
    contacts: parseContactTriples(bundle),
    burns: parseBurnFallbacks(bundle),
    machines: [
      ...machinesFromStructureDescriptions(bundle, shakerGoldChance),
      ...parseGrowerFallback(bundle),
    ],
  };
}

/** `[[r.RJ.Water,r.RJ.Sand,r.RJ.WetSand],...]` engine contact table. */
export function parseContactTriples(bundle: string): LiveContact[] {
  const table = bundle.match(
    /\[\[(?:[a-z])\.RJ\.(\w+),(?:[a-z])\.RJ\.(\w+),(?:[a-z])\.RJ\.(\w+)\](?:,\[(?:[a-z])\.RJ\.\w+,(?:[a-z])\.RJ\.\w+,(?:[a-z])\.RJ\.\w+\])+\]/,
  );
  if (!table) return [];
  const out: LiveContact[] = [];
  const tripleRe = /\[(?:[a-z])\.RJ\.(\w+),(?:[a-z])\.RJ\.(\w+),(?:[a-z])\.RJ\.(\w+)\]/g;
  let m: RegExpExecArray | null;
  while ((m = tripleRe.exec(table[0]!))) {
    out.push({
      inputs: [rjToElementId(m[1]!), rjToElementId(m[2]!)],
      outputs: [rjToElementId(m[3]!)],
    });
  }
  return out;
}

/** Fire map: `RJ.Residue]:()=>({output:{elementType:r.RJ.BurntResidue,chance:.25}})`. */
export function parseBurnFallbacks(bundle: string): LiveBurn[] {
  const out: LiveBurn[] = [];
  const re =
    /RJ\.(\w+)\]:\(\)=>\(\{output:\{elementType:[a-z]\.RJ\.(\w+),chance:([0-9]*\.?[0-9]+)\}\}\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(bundle))) {
    out.push({
      input: rjToElementId(m[1]!),
      output: rjToElementId(m[2]!),
      chance: Number(m[3]),
    });
  }
  return out;
}

/** Non-tutorial shaker gold chance: `RefineWetSand?.5:.25`. */
export function parseShakerGoldChance(bundle: string): number {
  const m = bundle.match(/RefineWetSand\?\.5:(\.[0-9]+|[0-9]*\.[0-9]+)/);
  if (m) return Number(m[1]);
  return 0.25;
}

/**
 * Structure locale strings like
 * `Drop {t:elements|burntResidue|name} … into {t:elements|gold|name} and {t:elements|seed|name}.`
 * Only structures that map to a recipe bag are turned into machine rows.
 */
export function machinesFromStructureDescriptions(
  bundle: string,
  shakerGoldChance = 0.25,
): LiveMachine[] {
  const descs = parseStructureDescriptions(bundle);
  const out: LiveMachine[] = [];
  for (const [structureId, raw] of descs) {
    const meta = STRUCTURE_MACHINE[structureId];
    if (!meta) continue;
    // Grower copy talks about flower harvest, not the WetSeed→Seedling step.
    if (structureId === "grower") continue;

    const elementIds = [...raw.matchAll(/\{t:elements\|([^|]+)\|name\}/g)].map(
      (match) => match[1]!,
    );
    if (elementIds.length < 2) continue;

    const input = elementIds[0]!;
    const outputs: LiveMachine["outputs"] = [];
    const seen = new Set<string>([input]);
    for (const id of elementIds.slice(1)) {
      if (seen.has(id)) continue;
      seen.add(id);
      if (structureId === "shaker" && id === "gold") {
        outputs.push({ id, chance: shakerGoldChance });
      } else {
        outputs.push({ id });
      }
    }
    if (outputs.length === 0) continue;

    const machineId = machineIdForStructure(structureId, meta.bag);
    out.push({ machineId, label: meta.label, input, outputs });
  }
  return out;
}

/** Engine grower fallback: WetSeed → Seedling when no mod grower row. */
export function parseGrowerFallback(bundle: string): LiveMachine[] {
  if (!/RJ\.WetSeed&&[\s\S]{0,160}RJ\.Seedling/.test(bundle)) return [];
  const meta = STRUCTURE_MACHINE.grower;
  return [
    {
      machineId: "grower",
      label: meta?.label ?? "Planter Box",
      input: "wetSeed",
      outputs: [{ id: "seedling" }],
    },
  ];
}

export function parseStructureDescriptions(bundle: string): Map<string, string> {
  const map = new Map<string, string>();
  const re = /"(structures\|([^"|]+)\|description)":"((?:\\.|[^"\\])*)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(bundle))) {
    const structureId = m[2]!;
    const raw = m[3]!.replace(/\\n/g, "\n").replace(/\\"/g, '"');
    map.set(structureId, raw);
  }
  return map;
}

function machineIdForStructure(structureId: string, bag: string): string {
  const byBag: Record<string, string> = {
    condensers: "condenser",
    steamDryers: "steamDryer",
    synthesizers: "synthesizer",
    snowmakers: "snowmaker",
    smelters: "smelter",
    shakers: "shaker",
    growers: "grower",
    kineticPresses: "kineticPress",
  };
  return byBag[bag] ?? structureId;
}

/** `BurntResidue` / `WetSand` → `burntResidue` / `wetSand`. */
export function rjToElementId(pascal: string): string {
  if (!pascal) return pascal;
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}
