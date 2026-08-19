/** Runtime React from Sandustry — do not import from "react". */
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
