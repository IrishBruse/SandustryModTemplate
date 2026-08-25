import { definePatches } from "@modkit/modinfo";

/**
 * Collector admission uses a hardcoded Gold + liquidGold type check.
 * Replace it with a money check: allow any element with collector value > 0.
 */
export const patches = definePatches([
  {
    id: "collector-admission-value-map-main",
    file: "js/bundle.js",
    find: 'const n=(e=>(null===l&&(l=s.FH.elements.getElementTypeFromId(e,"liquidGold")),l))(e);return t.type===r.RJ.Gold||t.type===n?d:f}',
    operation: "replace",
    code: "return s.FH.collector.getValueFromElementType(e,t.type)>0?d:f}",
    expectedMatches: 1,
    atomicGroup: "collector-admission-value-map",
  },
  {
    id: "collector-admission-value-map-simulation",
    file: "js/simulation-worker.js",
    find: 'const r=(e=>(null===l&&(l=o.FH.elements.getElementTypeFromId(e,"liquidGold")),l))(e);return t.type===n.RJ.Gold||t.type===r?u:h}',
    operation: "replace",
    code: "return o.FH.collector.getValueFromElementType(e,t.type)>0?u:h}",
    expectedMatches: 1,
    atomicGroup: "collector-admission-value-map",
  },
  {
    id: "collector-admission-value-map-utility",
    file: "js/utility-worker.js",
    find: 'const i=(e=>(null===l&&(l=o.FH.elements.getElementTypeFromId(e,"liquidGold")),l))(e);return t.type===n.RJ.Gold||t.type===i?c:h}',
    operation: "replace",
    code: "return o.FH.collector.getValueFromElementType(e,t.type)>0?c:h}",
    expectedMatches: 1,
    atomicGroup: "collector-admission-value-map",
  },
]);
