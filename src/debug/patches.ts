import { definePatches } from "@modkit/modinfo";

/**
 * Game-file rewrites for the debug companion. Prefer Sandkit when it can do the job.
 *
 * | id | File | Why a patch |
 * | --- | --- | --- |
 * | `local-mod-compile-reloaded` | `js/external-mod-runtime.js` | Loader must define free `reloaded` and the active mod id. |
 * | `local-mod-registry` | `js/external-mod-runtime.js` | Publish local mods so the companion can poll them. |
 * | `local-mod-track-inject` | `js/external-mod-runtime.js` | Auto-track `ui.inject` disposers for hot-eval. |
 *
 * Start save uses companion UI + `api.storage` (`boot/start-save-picker.tsx`). Choice fields cannot list live saves.
 *
 * Find strings are exact minified snippets. `expectedMatches: 1` fails the load if the game bundle changes.
 */

/** Vanilla `new Function` wrapper for a mod `main.js` (5 lines before source). */
const COMPILE_FIND =
  'return new Function("__sandkit",`"use strict";\\nconst sandkit = __sandkit;\\nreturn (async () => {\\n${e.entrySource}\\n})();\\n//# sourceURL=${r}`)';

/** Same line count. Sets free `reloaded` and `__sandkitHotReloadActive__`. */
const COMPILE_CODE =
  'return new Function("__sandkit",`"use strict";\\nconst sandkit = __sandkit;const reloaded=!!(globalThis.__sandkitHotReloadEvalIds__&&globalThis.__sandkitHotReloadEvalIds__.has("${e.manifest.id}"));globalThis.__sandkitHotReloadActive__="${e.manifest.id}";\\nreturn (async () => {\\n${e.entrySource}\\n})();\\n//# sourceURL=${r}`)';

const EXECUTE_FIND =
  "const t=ie(e,{manifest:i,discovered:r});e.store.integrity.modsUsed=!0,await c(t)";

/** After `ie(...)`, record local mods on `__sandkitLocalModRegistry__`. */
const EXECUTE_CODE =
  'const t=ie(e,{manifest:i,discovered:r});(function(rec,sk,fn){try{var w=rec.workshop;if(!w||!Array.isArray(w.discoveredVia)||w.discoveredVia.indexOf("local")<0)return;var g=globalThis;g.__sandkitLocalModRegistry__=g.__sandkitLocalModRegistry__||{};g.__sandkitLocalModRegistry__[rec.manifest.id]={id:rec.manifest.id,name:rec.manifest.name,rootUrl:rec.rootUrl,entry:rec.manifest.entry,workerEntry:rec.manifest.workerEntry||null,sandkit:sk,run:fn};}catch(err){}})(r,t,c);e.store.integrity.modsUsed=!0,await c(t)';

const INJECT_FIND =
  'return l.set(n,s),i.FH.ui.overlays.register(e,"global",n,function(){return $.createElement(o)}),()=>{const t=G.get(e);(null==t?void 0:t.get(n))===s&&(t.delete(n),i.FH.ui.overlays.unregister(e,"global",n))}';

/** Same unregister function, also passed to `__sandkitTrackInjectDispose`. */
const INJECT_CODE =
  'return l.set(n,s),i.FH.ui.overlays.register(e,"global",n,function(){return $.createElement(o)}),(function(){globalThis.__sandkitInjectDisposePatched__=true;var d=()=>{const t=G.get(e);(null==t?void 0:t.get(n))===s&&(t.delete(n),i.FH.ui.overlays.unregister(e,"global",n))};var a=globalThis.__sandkitHotReloadActive__,tr=globalThis.__sandkitTrackInjectDispose;tr&&a&&tr(a,d);return d})()';

const LOADER_GROUP = "local-mod-loader";

/** Exact `find` strings for tests against extracted game JS. */
export const LOADER_PATCH_FINDS = [COMPILE_FIND, EXECUTE_FIND, INJECT_FIND] as const;

export const patches = definePatches([
  {
    id: "local-mod-compile-reloaded",
    file: "js/external-mod-runtime.js",
    find: COMPILE_FIND,
    operation: "replace",
    code: COMPILE_CODE,
    expectedMatches: 1,
    atomicGroup: LOADER_GROUP,
  },
  {
    id: "local-mod-registry",
    file: "js/external-mod-runtime.js",
    find: EXECUTE_FIND,
    operation: "replace",
    code: EXECUTE_CODE,
    expectedMatches: 1,
    atomicGroup: LOADER_GROUP,
  },
  {
    id: "local-mod-track-inject",
    file: "js/external-mod-runtime.js",
    find: INJECT_FIND,
    operation: "replace",
    code: INJECT_CODE,
    expectedMatches: 1,
    atomicGroup: LOADER_GROUP,
  },
]);
