/** JSX automatic runtime — backed by sandkit.react (via the `react/jsx-runtime` alias). */
type ReactRuntime = typeof import("react") & {
  jsx?(type: unknown, props: unknown, key: unknown): import("react").ReactElement;
  jsxs?(type: unknown, props: unknown, key: unknown): import("react").ReactElement;
};

const runtime = sandkit.react as ReactRuntime;

export const Fragment = runtime.Fragment;

function jsxImpl(
  type: Parameters<typeof runtime.createElement>[0],
  props: Record<string, unknown> | null | undefined,
  key: unknown,
) {
  if (typeof runtime.jsx === "function") {
    return runtime.jsx(type, props, key);
  }

  const { children, ...rest } = props ?? {};
  const config = key !== undefined ? { ...rest, key } : rest;

  return children === undefined
    ? runtime.createElement(type, config)
    : runtime.createElement(type, config, children as import("react").ReactNode);
}

export const jsx = jsxImpl;
export const jsxs = typeof runtime.jsxs === "function" ? runtime.jsxs : jsxImpl;
