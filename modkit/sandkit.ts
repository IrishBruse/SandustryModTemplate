import type { SandkitGlobal } from "types/sandkit";

/**
 * Host-injected free variable when the game evaluates `main.js`
 * (`new Function("sandkit", source)`). Not a DevTools / `globalThis` binding.
 */
declare const sandkit: SandkitGlobal;

const hostSandkit: SandkitGlobal = sandkit;

export { hostSandkit as sandkit };
export type { SandkitGlobal };
