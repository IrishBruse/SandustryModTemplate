/**
 * Browser entry for the modkit IIFE (`dist/modkit/index.js`).
 * Assigns runtime namespaces on `globalThis.__modkit` for `main.js`.
 */
import * as debug from "./debug";
import * as jsxDevRuntime from "./jsx-dev-runtime";
import * as jsxRuntime from "./jsx-runtime";
import * as react from "./react";
import * as sandkitMod from "./sandkit";
import * as sdk from "./sdk";
import * as ui from "./ui";

export type ModkitGlobal = {
  sandkit: typeof sandkitMod;
  sdk: typeof sdk;
  debug: typeof debug;
  react: typeof react;
  jsxRuntime: typeof jsxRuntime;
  jsxDevRuntime: typeof jsxDevRuntime;
  ui: typeof ui;
};

declare global {
  // Bridged into main.js by the esbuild banner (Sandkit only evaluates main.js).
  var __modkit: ModkitGlobal | undefined;
}

globalThis.__modkit = {
  sandkit: sandkitMod,
  sdk,
  debug,
  react,
  jsxRuntime,
  jsxDevRuntime,
  ui,
};
