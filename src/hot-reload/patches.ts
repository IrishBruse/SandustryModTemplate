import { definePatches } from "@modkit/modinfo";
import { earlyDebugBadgePatchIife } from "./debug-badge/mount.ts";
import { bootMarkHelperIife, markCall } from "./boot/boot-marks.ts";
import { earlyAutoLoadPatchIife } from "./boot/auto-load.ts";
import { FAST_BOOT_STORAGE_KEY } from "./boot/fast-boot-keys.ts";

/**
 * Boot marks and fast-boot skips. Re-test find strings after each game update.
 */
const FAST = `localStorage.getItem(${JSON.stringify(FAST_BOOT_STORAGE_KEY)})==="true"`;

/** Redirect to ?db_load= before assets, shaders, and mods load (avoids a full double boot). */
const EARLY_AUTO_LOAD = earlyAutoLoadPatchIife();

/** Top-left debug marker before mods and React UI (splash included). */
const EARLY_DEBUG_BADGE = earlyDebugBadgePatchIife();

const EARLY_BOOT = EARLY_DEBUG_BADGE + bootMarkHelperIife() + EARLY_AUTO_LOAD;

export const debugPatches = definePatches([
  {
    id: "early-auto-load-save",
    file: "js/bundle.js",
    find: "(async()=>{var e,t,n,a,r,o;try{await async function(){const e=(0,Rn.M5)().locale",
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
    find: 'PI("ui|loading|startingGame",7)',
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
    find: "const{environment:T,shared:C,simSab:j,sabDescriptor:E}=function(e){",
    operation: "insertBefore",
    code: `${markCall("sabAlloc:start")};`,
    expectedMatches: 1,
  },
  {
    id: "boot-mark-workers",
    file: "js/bundle.js",
    find: "await A.environment.multithreading.simulation.init(A,E)",
    operation: "replace",
    code: `await(async()=>{${markCall("workers:start")};await A.environment.multithreading.simulation.init(A,E);${markCall("workers:done")}})()`,
    expectedMatches: 1,
  },
  {
    id: "boot-mark-pj",
    file: "js/bundle.js",
    find: "await pj(e)",
    operation: "replace",
    code: `await(async()=>{${markCall("bindings:start")};await pj(e);${markCall("bindings:done")}})()`,
    expectedMatches: 1,
  },
  {
    id: "boot-mark-mods",
    file: "js/bundle.js",
    find: "a=await n(e,t.mods,t.diagnostics)",
    operation: "replace",
    code: `a=await(async()=>{${markCall("mods:start")};var x=await n(e,t.mods,t.diagnostics);${markCall("mods:done")};return x})()`,
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
    find: "const t=ie(e,{manifest:i,discovered:r});e.store.integrity.modsUsed=!0,await c(t)",
    operation: "replace",
    code: "const t=ie(e,{manifest:i,discovered:r});(globalThis.__sandkitByMod||(globalThis.__sandkitByMod={}))[i.id]=t;e.store.integrity.modsUsed=!0,await c(t)",
    expectedMatches: 1,
  },
  {
    id: "skip-start-foliage-generate",
    file: "js/bundle.js",
    find: "await ie.FH.foliage.generate()",
    operation: "replace",
    code: `await(async()=>{${markCall("foliage:start")};var x=${FAST}?undefined:await ie.FH.foliage.generate();${markCall("foliage:done")};return x})()`,
    expectedMatches: 1,
  },
]);
