import { mountDebugBadge } from "./mount";

/** Always-on top-left debug marker (raw DOM, no React). */
export function installDebugBadge(_api: SandkitApi, _modId: string): () => void {
  return mountDebugBadge();
}
