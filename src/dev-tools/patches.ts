import { definePatches } from "@modkit/patches";
import { bootMarkHelperIife, markCall } from "./boot/boot-marks.ts";
import { earlyAutoLoadPatchIife } from "./boot/auto-load.ts";
import { fastBootLocalStorageExpr } from "./boot/fast-boot-keys.ts";
import { bootstrapApiWrapIife } from "./reload/first-load-wrap.ts";

/**
 * Boot marks and fast-boot skips. Find strings matched against
 * `sandustry/0.5.5-mods/dist/js/` (game 0.5.5). Re-test after each game update.
 */
const FAST = fastBootLocalStorageExpr();

/** Redirect to ?db_load= before assets, shaders, and mods load (avoids a full double boot). */
const EARLY_AUTO_LOAD = earlyAutoLoadPatchIife();

/** Log wrap for other mods' sandkit before any mod entry runs. */
const EARLY_API_WRAP = bootstrapApiWrapIife();

const EARLY_BOOT = bootMarkHelperIife() + EARLY_API_WRAP + EARLY_AUTO_LOAD;

export const debugPatches = definePatches([
  {
    id: "early-auto-load-save",
    file: "js/bundle.js",
    find: "(async()=>{var e,t,n,r,o,a;try{await async function(){const e=(0,rr.M5)().locale",
    operation: "insertBefore",
    code: EARLY_BOOT,
    expectedMatches: 1,
  },
  {
    id: "skip-splash-on-save-load",
    file: "js/bundle.js",
    find: 'if(!e)if(sessionStorage.getItem("splashShown")){',
    operation: "replace",
    code: `if(!e)if(sessionStorage.getItem("splashShown")&&!new URLSearchParams(location.search).has("db_load")){`,
    expectedMatches: 1,
  },
  {
    id: "boot-mark-starting-game",
    file: "js/bundle.js",
    find: 'wL("ui|loading|startingGame",7)',
    operation: "insertBefore",
    code: `${markCall("startingGame")};`,
    expectedMatches: 1,
  },
  {
    id: "boot-mark-save-load",
    file: "js/bundle.js",
    find: 'await(0,le.Hh)(n.get("db_load"))',
    operation: "replace",
    code: `await(async()=>{${markCall("saveLoad:start")};var x=await(0,le.Hh)(n.get("db_load"));${markCall("saveLoad:done")};return x})()`,
    expectedMatches: 1,
  },
  {
    id: "boot-mark-sab-alloc",
    file: "js/bundle.js",
    find: "{environment:t,shared:a,simSab:l,sabDescriptor:i}}(C);",
    operation: "insertBefore",
    // Comma, not semicolon: this object is a comma-expression value, not a statement.
    code: `${markCall("sabAlloc:start")},`,
    expectedMatches: 1,
  },
  {
    id: "boot-mark-workers",
    file: "js/bundle.js",
    find: "await C.environment.multithreading.simulation.init(C,P)",
    operation: "replace",
    code: `await(async()=>{${markCall("workers:start")};await C.environment.multithreading.simulation.init(C,P);${markCall("workers:done")}})()`,
    expectedMatches: 1,
  },
  {
    id: "boot-mark-pj",
    file: "js/bundle.js",
    find: "if(await RE(e),t&&t.mods.length>0)",
    operation: "replace",
    code: `if(await(async()=>{${markCall("bindings:start")};var x=await RE(e);${markCall("bindings:done")};return x})(),t&&t.mods.length>0)`,
    expectedMatches: 1,
  },
  {
    id: "boot-mark-mods",
    file: "js/bundle.js",
    find: "r=await n(e,t.mods,t.diagnostics)",
    operation: "replace",
    code: `r=await(async()=>{${markCall("mods:start")};var x=await n(e,t.mods,t.diagnostics);${markCall("mods:done")};return x})()`,
    expectedMatches: 1,
  },
  {
    id: "boot-mark-loading-hide",
    file: "js/bundle.js",
    find: 'const e=document.getElementById("loading");e.style.opacity="0"',
    operation: "insertBefore",
    code: `${markCall("loadingHide")};`,
    expectedMatches: 1,
  },
  {
    id: "stash-sandkit-by-mod",
    file: "js/external-mod-runtime.js",
    find: "const t=we(e,{manifest:o,discovered:r});e.store.integrity.modsUsed=!0,await c(t)",
    operation: "replace",
    // Stash the raw host for hot reload. Wrap the copy passed to `c` when
    // `__devToolsWrapSandkit` is set (early boot installs a log wrap; companion
    // main upgrades it for dispose tracking).
    code: "const t=we(e,{manifest:o,discovered:r});(globalThis.__sandkitByMod||(globalThis.__sandkitByMod={}))[o.id]=t;e.store.integrity.modsUsed=!0,await c((typeof globalThis.__devToolsWrapSandkit==='function'?globalThis.__devToolsWrapSandkit(o.id,t):t))",
    expectedMatches: 1,
  },
  {
    id: "skip-start-foliage-generate",
    file: "js/bundle.js",
    find: "await se.FH.foliage.generate()",
    operation: "replace",
    code: `await(async()=>{${markCall("foliage:start")};var x=${FAST}?undefined:await se.FH.foliage.generate();${markCall("foliage:done")};return x})()`,
    expectedMatches: 1,
  },
]);
