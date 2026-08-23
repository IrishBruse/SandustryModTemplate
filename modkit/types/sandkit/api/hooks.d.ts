export namespace hooks {
  export function intercept<K extends keyof InterceptHookMap>(hookId: K, callback: (args: InterceptHookMap[K], context: HookContext) => void, options?: HookOptions): () => void;
  export function modify<K extends keyof ModifierHookMap>(hookId: K, callback: (args: ModifierHookMap[K]) => void, options?: HookOptions): () => void;

  // TODO
  export type InterceptHookMap = unknown
  export type HookContext = unknown
  export type ModifierHookMap = unknown
  export type HookOptions = unknown
}

