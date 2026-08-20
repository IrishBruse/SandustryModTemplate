import type { ReactElement } from "react";
import type { SandkitApi } from "./api";
import type { RetroConsoleApi } from "./engine";

export interface SandkitEnums {
  Scene?: {
    MainMenu: number;
    Intro: number;
  };
  [key: string]: unknown;
}

export interface SandkitEngineApi {
  retroConsole?: RetroConsoleApi;
  [key: string]: unknown;
}

export type SandkitReact = typeof import("react") & {
  jsx?(type: unknown, props: unknown, key: unknown): ReactElement;
  jsxs?(type: unknown, props: unknown, key: unknown): ReactElement;
};

export interface SandkitGlobal {
  api: SandkitApi;
  enums: SandkitEnums;
  react: SandkitReact;
  engine: {
    api: SandkitEngineApi;
    state: unknown;
  };
}
