/** Runtime React from Sandustry — import via the `react` alias (resolves to `modkit/esbuild/react.ts` at build time). */
const runtime = sandkit.react;

export default runtime;
export const {
  createElement,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
  useRef,
  Fragment,
} = runtime;
