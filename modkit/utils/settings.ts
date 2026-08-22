import { safe } from "./safe";

export function isEnabled(api: SandkitApi): boolean {
  const value = safe(() => api.settings.get("enabled"));
  return typeof value === "boolean" ? value : true;
}
