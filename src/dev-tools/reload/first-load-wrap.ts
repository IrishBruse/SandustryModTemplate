import { COMPANION_MOD_ID } from "../boot/auto-load-save.ts";
import { wrapSandkit } from "./wrap-api.ts";

export const DEV_TOOLS_WRAP_SANDKIT_KEY = "__devToolsWrapSandkit";

type WrapFn = (modId: string, host: { api: object }) => { api: object };

type WrapGlobals = typeof globalThis & {
  [DEV_TOOLS_WRAP_SANDKIT_KEY]?: WrapFn;
};

/**
 * Early-boot IIFE: install a log wrap for hot-reload-sensitive APIs before any
 * mod `main.js` runs. Session entry order does not always honor `loadOrder`.
 */
export function bootstrapApiWrapIife(): string {
  const selfId = JSON.stringify(COMPANION_MOD_ID);
  const key = JSON.stringify(DEV_TOOLS_WRAP_SANDKIT_KEY);
  return `(function(){try{var K=${key},S=${selfId};if(typeof globalThis[K]==="function")return;function sum(v){var t=typeof v;if(t==="function")return v.name?("[Function "+v.name+"]"):"[Function]";if(v&&t==="object"){if(Array.isArray(v))return v.slice(0,12).map(sum);var o={},n=0;for(var k in v){if(!Object.prototype.hasOwnProperty.call(v,k))continue;if(n++>=12){o["..."]="+";break}o[k]=sum(v[k])}return o}return v}function log(id,path,args){try{console.log.apply(console,[id+" "+path].concat(args.map(sum)))}catch(e){}}function wrapFn(id,path,fn,self){return function(){var a=[].slice.call(arguments);log(id,path,a);return fn.apply(self,a)}}function copy(ns){var o={};for(var k in ns)if(Object.prototype.hasOwnProperty.call(ns,k))o[k]=ns[k];return o}function wrapMethods(ns,names,id,prefix){if(!ns||typeof ns!=="object")return ns;var o=copy(ns);for(var i=0;i<names.length;i++){var name=names[i];if(typeof ns[name]==="function")o[name]=wrapFn(id,prefix+"."+name,ns[name],ns)}return o}globalThis[K]=function(modId,host){if(!host||!host.api||modId===S)return host;var api=host.api,out=copy(api);if(api.ui){out.ui=wrapMethods(api.ui,["inject"],modId,"api.ui");if(api.ui.overlays)out.ui.overlays=wrapMethods(api.ui.overlays,["register"],modId,"api.ui.overlays");if(api.ui.regions)out.ui.regions=wrapMethods(api.ui.regions,["mount"],modId,"api.ui.regions")}if(api.events)out.events=wrapMethods(api.events,["on"],modId,"api.events");if(api.settings)out.settings=wrapMethods(api.settings,["onChange"],modId,"api.settings");if(api.hooks)out.hooks=wrapMethods(api.hooks,["intercept","modify"],modId,"api.hooks");if(api.input)out.input=wrapMethods(api.input,["registerBinding"],modId,"api.input");var wrapped=copy(host);wrapped.api=out;return wrapped}}catch(e){}})();`;
}

/**
 * Replace the early-boot log wrap with the full hot-reload wrap (dispose tracking).
 * Safe to call from companion `main.js` even when other mods already evaluated.
 */
export function installFirstLoadApiWrap(selfId: string): void {
  const g = globalThis as WrapGlobals;
  g[DEV_TOOLS_WRAP_SANDKIT_KEY] = (modId, host) => {
    if (modId === selfId) return host;
    return wrapSandkit(host, modId);
  };
}
