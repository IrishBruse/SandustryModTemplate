/** JSX dev runtime — falls back to production jsx when jsxDEV is unavailable. */
import { jsx } from "./jsx-runtime";

type ReactRuntime = typeof import("react") & {
  jsxDEV?(
    type: unknown,
    props: unknown,
    key: unknown,
    isStaticChildren: boolean,
    source: unknown,
    self: unknown,
  ): import("react").ReactElement;
};

const runtime = sandkit.react as ReactRuntime;

export { Fragment } from "./jsx-runtime";

export function jsxDEV(
  type: Parameters<typeof runtime.createElement>[0],
  props: Record<string, unknown> | null | undefined,
  key: unknown,
  isStaticChildren: boolean,
  source: unknown,
  self: unknown,
) {
  if (typeof runtime.jsxDEV === "function") {
    return runtime.jsxDEV(type, props, key, isStaticChildren, source, self);
  }
  return jsx(type, props, key);
}
