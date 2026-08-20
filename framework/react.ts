/** Runtime React from Sandustry — import via the `react` alias (resolves to `framework/react.ts` at build time). */
const runtime = sandkit.react;

export default runtime;
export const {
  createElement,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  Fragment,
} = runtime;
