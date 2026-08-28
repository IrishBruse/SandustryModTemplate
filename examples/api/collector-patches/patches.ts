import { definePatches } from "@modkit/patches";

/**
 * Collector admission uses a hardcoded Gold + liquidGold type check.
 * Replace it with a value check: allow any element with collector value > 0.
 * Find strings matched against `sandustry/0.5.5-mods/dist/js/` (game 0.5.5).
 */
export const patches = definePatches([
  {
    id: "collector-admission-value-map-main",
    file: "js/bundle.js",
    find: 'const n=(e=>(null===l&&(l=i.FH.elements.getElementTypeFromId(e,"liquidGold")),l))(e);return t.type===o.RJ.Gold||t.type===n?d:f}',
    operation: "replace",
    code: "return i.FH.collector.getValueFromElementType(e,t.type)>0?d:f}",
    expectedMatches: 1,
    atomicGroup: "collector-admission-value-map",
  },
  {
    id: "collector-admission-value-map-simulation",
    file: "js/simulation-worker.js",
    find: 'const i=(e=>(null===l&&(l=o.FH.elements.getElementTypeFromId(e,"liquidGold")),l))(e);return t.type===r.RJ.Gold||t.type===i?u:h}',
    operation: "replace",
    code: "return o.FH.collector.getValueFromElementType(e,t.type)>0?u:h}",
    expectedMatches: 1,
    atomicGroup: "collector-admission-value-map",
  },
  {
    id: "collector-admission-value-map-utility",
    file: "js/utility-worker.js",
    find: 'const i=(e=>(null===l&&(l=o.FH.elements.getElementTypeFromId(e,"liquidGold")),l))(e);return t.type===r.RJ.Gold||t.type===i?u:h}',
    operation: "replace",
    code: "return o.FH.collector.getValueFromElementType(e,t.type)>0?u:h}",
    expectedMatches: 1,
    atomicGroup: "collector-admission-value-map",
  },
]);
