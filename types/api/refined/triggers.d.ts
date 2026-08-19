import type { ApiHandler, DataBag } from "../../common";

export interface TriggerRegistration extends DataBag {
  interval?: number;
  sequentialRuns?: number;
  extra?: unknown;
  callback: ApiHandler;
}

export interface TriggersApi {
  register(id: string, options: TriggerRegistration): void;
}
