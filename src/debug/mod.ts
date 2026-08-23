import { defineModInfo, definePatches } from "@modkit/modinfo";
import {
  COMPILE_CODE,
  COMPILE_FIND,
  EXECUTE_CODE,
  EXECUTE_FIND,
  INJECT_CODE,
  INJECT_FIND,
} from "./loader-patches";

/**
 * Inserted into the minified assignment chain (`...,Q_=...`).
 * Must be a bare assignment (no `const`/`let`) so it stays a valid comma expression.
 * Name `sv_` must not already exist in `js/bundle.js`.
 */
const START_SAVE_SELECT =
  'sv_=({value:e,field:t,label:n,description:a,onChange:r,className:o})=>{const[s,i]=(0,Rc.useState)(()=>t.options.map(e=>({value:e.value,label:(0,Ho.t)(e.labelKey)})));(0,Rc.useEffect)(()=>{const e=window.electron;if(!e||!e.getSaveFiles)return;let t=!1;e.getSaveFiles().then(e=>{if(t)return;const n=[...e].sort((e,t)=>Date.parse(t.timestamp||"")-Date.parse(e.timestamp||""));i([{value:"__last__",label:"Last played"},...n.map(e=>{const t=(e.name||"").trim()||e.id,n=(e.worldName||"").trim();return{value:e.id,label:n&&n!==t?t+" ("+n+")":t}})])}).catch(()=>{});return()=>{t=!0}});return(0,wv.jsx)(J_,Object.assign({label:n,description:a},{children:(0,wv.jsx)(z_,{value:e,options:s,onChange:r,className:o})}))},';

/** Re-add the vanilla Options → Debug tab (content ships in bundle; tab button was omitted). */
export const patches = definePatches([
  {
    id: "options-debug-tab",
    file: "js/bundle.js",
    find: 'F.length>0&&P.push("mods");const O=',
    operation: "replace",
    code: 'F.length>0&&P.push("mods");P.push("debug");const O=',
    expectedMatches: 1,
  },
  {
    id: "mod-settings-start-save-select",
    file: "js/bundle.js",
    find: "Q_=({state:e,manifests:t})=>",
    operation: "insertBefore",
    code: START_SAVE_SELECT,
    expectedMatches: 1,
  },
  {
    id: "mod-settings-start-save-choice",
    file: "js/bundle.js",
    find: 'if("choice"===i.type)return(0,wv.jsx)(J_,Object.assign({label:c,description:d},{children:(0,wv.jsx)(z_,{value:"string"==typeof l?l:i.default,options:i.options.map(e=>({value:e.value,label:(0,Ho.t)(e.labelKey)})),onChange:u,className:"min-w-40"})}),n);',
    operation: "replace",
    code: 'if("choice"===i.type)return"startSave"===n&&"irishbruse.debug"===t.id?(0,wv.jsx)(sv_,{value:"string"==typeof l?l:i.default,field:i,label:c,description:d,onChange:u,className:"min-w-40"},n):(0,wv.jsx)(J_,Object.assign({label:c,description:d},{children:(0,wv.jsx)(z_,{value:"string"==typeof l?l:i.default,options:i.options.map(e=>({value:e.value,label:(0,Ho.t)(e.labelKey)})),onChange:u,className:"min-w-40"})}),n);',
    expectedMatches: 1,
  },
  {
    id: "local-mod-compile-reloaded",
    file: "js/external-mod-runtime.js",
    find: COMPILE_FIND,
    operation: "replace",
    code: COMPILE_CODE,
    expectedMatches: 1,
  },
  {
    id: "local-mod-registry",
    file: "js/external-mod-runtime.js",
    find: EXECUTE_FIND,
    operation: "replace",
    code: EXECUTE_CODE,
    expectedMatches: 1,
  },
  {
    id: "local-mod-track-inject",
    file: "js/external-mod-runtime.js",
    find: INJECT_FIND,
    operation: "replace",
    code: INJECT_CODE,
    expectedMatches: 1,
  },
]);

export const modinfo = defineModInfo({
  manifestVersion: 1,
  id: "irishbruse.debug",
  name: "debug",
  version: "0.0.1",
  apiVersion: 1,
  entry: "main.js",
  author: "IrishBruse",
  description:
    "Dev companion: DevTools, auto-load save, disable autosave, Options Debug tab, local-mod hot reload. Installed on debug builds only.",
  dependencies: [],
  /** Lower `loadOrder` runs first. 32-bit minimum so this companion starts before other local mods. */
  loadOrder: -2147483648,
  configSchema: {
    enabled: {
      type: "boolean",
      default: true,
      labelKey: "Mod enabled",
      descriptionKey: "Turn all debug helpers off without removing the mod.",
    },
    openDevTools: {
      type: "boolean",
      default: false,
      labelKey: "Open DevTools on load",
      descriptionKey:
        "Open Electron DevTools when the mod loads. Keep off while using F5 so the IDE debugger stays attached.",
    },
    f12DevTools: {
      type: "boolean",
      default: true,
      labelKey: "F12 opens DevTools",
      descriptionKey: "F12 opens Electron DevTools. That can disconnect an IDE debugger session.",
    },
    autoLoad: {
      type: "boolean",
      default: true,
      labelKey: "Auto-load save",
      descriptionKey:
        "On load, reload with ?db_load= for the save chosen below. Skips the splash and main menu.",
    },
    startSave: {
      type: "choice",
      default: "__last__",
      labelKey: "Start save",
      descriptionKey: "Used when Auto-load save is on. Applies on the next main-menu boot.",
      options: [{ value: "__last__", labelKey: "Last played" }],
    },
    engineDebug: {
      type: "boolean",
      default: true,
      labelKey: "Engine debug",
      descriptionKey:
        "Turns engine debug.active on so vanilla Debug / Stats appear. F3 toggles the companion debug overlay. Also under Options → Debug.",
    },
    disableAutosave: {
      type: "boolean",
      default: true,
      labelKey: "Disable autosave",
      descriptionKey:
        "Set the session autosave interval to 0. Manual saves still work. Turn off to test autosave.",
    },
    watchLocalMods: {
      type: "boolean",
      default: true,
      labelKey: "Watch local mods",
      descriptionKey: "Poll local mod folders for file changes. Workshop mods are never watched.",
    },
    hotReloadFallback: {
      type: "choice",
      default: "toast",
      labelKey: "If hot reload cannot run",
      descriptionKey:
        "When a local main.js changed but the mod has no dispose path: do nothing, toast, or reload the page. Reloading the page does not re-apply patches.json. Restart the game for patches.",
      options: [
        { value: "off", labelKey: "Do nothing" },
        { value: "toast", labelKey: "Toast" },
        { value: "reload", labelKey: "Reload page" },
      ],
    },
  },
});
