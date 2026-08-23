/**
 * String rewrites for `js/external-mod-runtime.js`.
 * Keep find strings exact against the minified file. expectedMatches: 1.
 */

export const COMPILE_FIND =
  'return new Function("__sandkit",`"use strict";\\nconst sandkit = __sandkit;\\nreturn (async () => {\\n${e.entrySource}\\n})();\\n//# sourceURL=${r}`)';

/** Same wrapper line count as vanilla (source maps stay at offset 5). */
export const COMPILE_CODE =
  'return new Function("__sandkit",`"use strict";\\nconst sandkit = __sandkit;const reloaded=!!(globalThis.__sandkitHotReloadEvalIds__&&globalThis.__sandkitHotReloadEvalIds__.has("${e.manifest.id}"));globalThis.__sandkitHotReloadActive__="${e.manifest.id}";\\nreturn (async () => {\\n${e.entrySource}\\n})();\\n//# sourceURL=${r}`)';

export const EXECUTE_FIND =
  "const t=ie(e,{manifest:i,discovered:r});e.store.integrity.modsUsed=!0,await c(t)";

export const EXECUTE_CODE =
  'const t=ie(e,{manifest:i,discovered:r});(function(rec,sk,fn){try{var w=rec.workshop;if(!w||!Array.isArray(w.discoveredVia)||w.discoveredVia.indexOf("local")<0)return;var g=globalThis;g.__sandkitLocalModRegistry__=g.__sandkitLocalModRegistry__||{};g.__sandkitLocalModRegistry__[rec.manifest.id]={id:rec.manifest.id,name:rec.manifest.name,rootUrl:rec.rootUrl,entry:rec.manifest.entry,workerEntry:rec.manifest.workerEntry||null,sandkit:sk,run:fn};}catch(err){}})(r,t,c);e.store.integrity.modsUsed=!0,await c(t)';

export const INJECT_FIND =
  'return l.set(n,s),i.FH.ui.overlays.register(e,"global",n,function(){return $.createElement(o)}),()=>{const t=G.get(e);(null==t?void 0:t.get(n))===s&&(t.delete(n),i.FH.ui.overlays.unregister(e,"global",n))}';

export const INJECT_CODE =
  'return l.set(n,s),i.FH.ui.overlays.register(e,"global",n,function(){return $.createElement(o)}),(function(){var d=()=>{const t=G.get(e);(null==t?void 0:t.get(n))===s&&(t.delete(n),i.FH.ui.overlays.unregister(e,"global",n))};var a=globalThis.__sandkitHotReloadActive__,tr=globalThis.__sandkitTrackInjectDispose;tr&&a&&tr(a,d);return d})()';
