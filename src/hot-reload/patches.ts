import { definePatches } from "@modkit/modinfo";

/**
 * Full shader-compile skip for Options → Skip shader recompile.
 * Guards read localStorage so the early Pixi outline compile (before mods) is skipped too.
 * Re-test find strings after each game update.
 */
const SKIP = 'localStorage.getItem("hot-reload.skipShaderRecomp")==="true"';

/** Tiny passthrough — still constructs a Filter, but avoids Sn() + the huge outline GLSL compile. */
const CHEAP_FRAG =
  "precision mediump float;varying vec2 vTextureCoord;uniform sampler2D uSampler;void main(){gl_FragColor=texture2D(uSampler,vTextureCoord);}";

export const debugPatches = definePatches([
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
