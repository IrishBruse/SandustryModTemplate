/**
 * Host React runtime at `sandkit.react`.
 *
 * Kept intentionally shallow so TypeDoc does not ingest `@types/react` / DOM.
 * Mods should import `react` through the template JSX runtime, not this bag
 * directly, unless you need to reach the host copy at runtime.
 */
export type SandkitReact = {
  /** Create a React element (host copy). */
  createElement?(...args: unknown[]): unknown;
  /** Create a React context (host copy). */
  createContext?(...args: unknown[]): unknown;
  /** Create a ref object (host copy). */
  createRef?(...args: unknown[]): unknown;
  /** Wrap a component to forward refs (host copy). */
  forwardRef?(...args: unknown[]): unknown;
  /** Memoize a component (host copy). */
  memo?(...args: unknown[]): unknown;
  /** Lazy-load a component (host copy). */
  lazy?(...args: unknown[]): unknown;
  /** State hook (host copy). */
  useState?(...args: unknown[]): unknown;
  /** Effect hook (host copy). */
  useEffect?(...args: unknown[]): unknown;
  /** Layout effect hook (host copy). */
  useLayoutEffect?(...args: unknown[]): unknown;
  /** Memo hook (host copy). */
  useMemo?(...args: unknown[]): unknown;
  /** Callback hook (host copy). */
  useCallback?(...args: unknown[]): unknown;
  /** Ref hook (host copy). */
  useRef?(...args: unknown[]): unknown;
  /** Context hook (host copy). */
  useContext?(...args: unknown[]): unknown;
  /** Fragment symbol (host copy). */
  Fragment?: unknown;
  /** Base class component (host copy). */
  Component?: unknown;
  /** Pure class component (host copy). */
  PureComponent?: unknown;
  /** Strict mode wrapper (host copy). */
  StrictMode?: unknown;
  /** Suspense boundary (host copy). */
  Suspense?: unknown;
  /** React version string from the host bundle. */
  version?: string;
  /** Additional host exports not listed here. */
  readonly [key: string]: unknown;
};
