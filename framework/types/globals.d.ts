import type { SandkitApi } from "./api";
import type { SandkitGlobal } from "./sandkit";

declare global {
  var sandkit: SandkitGlobal;
  var api: SandkitApi;
  var enums: SandkitGlobal["enums"];
  var react: SandkitGlobal["react"];
}

export {};
