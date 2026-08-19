import type { ApiHandler, DataBag } from "../../common";

export interface HookOptions extends DataBag {
  priority?: number;
  modId?: string;
}

export interface HooksApi {
  intercept(hook: string, handler: ApiHandler, options?: HookOptions): void;
  modify(hook: string, handler: ApiHandler, options?: HookOptions): void;
}
