/**
 * Host React runtime from `sandkit.react`.
 *
 * Kept intentionally shallow so TypeDoc does not ingest `@types/react` / DOM.
 * Mods should import `react` through the template jsx runtime.
 */
export type SandkitReact = {
  createElement?(...args: unknown[]): unknown;
  createContext?(...args: unknown[]): unknown;
  createRef?(...args: unknown[]): unknown;
  forwardRef?(...args: unknown[]): unknown;
  memo?(...args: unknown[]): unknown;
  lazy?(...args: unknown[]): unknown;
  useState?(...args: unknown[]): unknown;
  useEffect?(...args: unknown[]): unknown;
  useLayoutEffect?(...args: unknown[]): unknown;
  useMemo?(...args: unknown[]): unknown;
  useCallback?(...args: unknown[]): unknown;
  useRef?(...args: unknown[]): unknown;
  useContext?(...args: unknown[]): unknown;
  Fragment?: unknown;
  Component?: unknown;
  PureComponent?: unknown;
  StrictMode?: unknown;
  Suspense?: unknown;
  version?: string;
  readonly [key: string]: unknown;
};
