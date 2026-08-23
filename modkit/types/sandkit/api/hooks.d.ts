/**
 * `sandkit.api.hooks` — intercept and modify internal game hook points.
 * Main thread only.
 */
export namespace hooks {
  /** Registers an intercept hook. Returns an unsubscribe function. */
  export function intercept<K extends keyof InterceptHookMap>(hookId: K, callback: (args: InterceptHookMap[K], context: HookContext) => void, options?: HookOptions): () => void;
  /** Registers a modifier hook. Returns an unsubscribe function. */
  export function modify<K extends keyof ModifierHookMap>(hookId: K, callback: (args: ModifierHookMap[K]) => void, options?: HookOptions): () => void;

  // TODO
  /** Map of intercept hook ids to argument shapes (not yet typed in declarations). */
  export type InterceptHookMap = unknown
  /** Context passed to intercept hook callbacks (not yet typed in declarations). */
  export type HookContext = unknown
  /** Map of modifier hook ids to argument shapes (not yet typed in declarations). */
  export type ModifierHookMap = unknown
  /** Options for hook registration (not yet typed in declarations). */
  export type HookOptions = unknown
}

