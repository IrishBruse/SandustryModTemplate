import { definePatches } from "@modkit/modinfo";
import { earlyDebugBadgePatchIife } from "./debug-badge/mount.ts";
import { earlyAutoLoadPatchIife } from "./boot/auto-load.ts";
import { FAST_BOOT_STORAGE_KEY } from "./boot/fast-boot-keys.ts";

/**
 * Full shader-compile skip for Options → Skip shader recompile.
 * Guards read localStorage so the early Pixi outline compile (before mods) is skipped too.
 * Re-test find strings after each game update.
 */
const SKIP = 'localStorage.getItem("hot-reload.skipShaderRecomp")==="true"';
const FAST = `localStorage.getItem(${JSON.stringify(FAST_BOOT_STORAGE_KEY)})==="true"`;

/** Redirect to ?db_load= before assets, shaders, and mods load (avoids a full double boot). */
const EARLY_AUTO_LOAD = earlyAutoLoadPatchIife();

/** Top-left debug marker before mods and React UI (splash included). */
const EARLY_DEBUG_BADGE = earlyDebugBadgePatchIife();

const EARLY_BOOT = EARLY_DEBUG_BADGE + EARLY_AUTO_LOAD;

/** Tiny passthrough — still constructs a Filter, but avoids Sn() + the huge outline GLSL compile. */
const CHEAP_FRAG =
  "precision mediump float;varying vec2 vTextureCoord;uniform sampler2D uSampler;void main(){gl_FragColor=texture2D(uSampler,vTextureCoord);}";

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
    operation: "insertBefore",
    code: `if(${FAST}&&new URLSearchParams(location.search).has("db_load"))try{sessionStorage.setItem("splashShown","true")}catch(e){}`,
    expectedMatches: 1,
  },
  {
    id: "skip-initial-outline-shader",
    file: "js/bundle.js",
    find: "const Z=Sn();let Q=new dn.dJT(null,Z,{",
    operation: "replace",
    code: `const Z=${SKIP}?${JSON.stringify(CHEAP_FRAG)}:Sn();let Q=new dn.dJT(null,Z,{`,
    expectedMatches: 1,
  },
  {
    id: "skip-outline-shader-recomp",
    file: "js/bundle.js",
    find: "regenerateOutlineElementsShader:function(){",
    operation: "wrap",
    before: "",
    after: `if(${SKIP})return;`,
    expectedMatches: 1,
  },
  {
    id: "skip-shader-warmup",
    file: "js/bundle.js",
    find: "warmup:(e,t,n)=>{",
    operation: "wrap",
    before: "",
    after: `if(${SKIP})return;`,
    expectedMatches: 1,
  },
  {
    id: "skip-compiling-shaders-ui-open",
    file: "js/bundle.js",
    find: 'const r=document.createElement("div");r.style.cssText="text-align: center; font-size: 13px; line-height: 1.4;";',
    operation: "wrap",
    before: `if(!(${SKIP})){`,
    after: "",
    expectedMatches: 1,
    atomicGroup: "skip-compiling-shaders-ui",
  },
  {
    id: "skip-compiling-shaders-ui-close",
    file: "js/bundle.js",
    find: "r.remove(),l.remove()",
    operation: "wrap",
    before: "",
    after: "}",
    expectedMatches: 1,
    atomicGroup: "skip-compiling-shaders-ui",
  },
  {
    id: "stash-sandkit-by-mod",
    file: "js/external-mod-runtime.js",
    find: "const t=ie(e,{manifest:i,discovered:r});e.store.integrity.modsUsed=!0,await c(t)",
    operation: "replace",
    code: "const t=ie(e,{manifest:i,discovered:r});(globalThis.__sandkitByMod||(globalThis.__sandkitByMod={}))[i.id]=t;e.store.integrity.modsUsed=!0,await c(t)",
    expectedMatches: 1,
  },
]);
