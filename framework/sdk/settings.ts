import type { SandkitApi } from "types/api";
import { safe } from "./safe";

export function isEnabled(api: SandkitApi): boolean {
  const value = safe(() => api.settings.get("enabled"));
  return typeof value === "boolean" ? value : true;
}

export function debugEnabled(api: SandkitApi): boolean {
  const value = safe(() => api.settings.get("debug"));
  return typeof value === "boolean" ? value : true;
}
