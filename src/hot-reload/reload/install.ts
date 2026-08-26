import { discoverLocalMods, readModsState } from "./discover.ts";
import { hotEvalMain } from "./hot-eval.ts";
import { decideReload, fetchMain } from "./poll.ts";

const POLL_MS = 500;

function selfMainUrl(api: SandkitApi, selfId: string): string {
  try {
    const url = api.assets.getUrl("main.js");
    if (typeof url === "string" && url.length > 0) return url;
  } catch {
    /* fall through */
  }
  return `sandkit-workshop://${selfId}/main.js`;
}

/**
 * Poll sibling `main.js` files and re-eval when the text is stable and changed.
 * Does not reload this companion. First successful fetch only records a baseline.
 */
export function installLocalModReload(api: SandkitApi, selfId: string): () => void {
  const companionMain = selfMainUrl(api, selfId);
  const lastApplied = new Map<string, string>();
  const pending = new Map<string, string>();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let stopped = false;

  async function tick(): Promise<void> {
    const mods = discoverLocalMods(selfId, companionMain, readModsState());
    for (const mod of mods) {
      const text = await fetchMain(mod.mainUrl);
      if (text == null) continue;

      const decision = decideReload(lastApplied.get(mod.id), pending.get(mod.id), text);
      if (decision === "skip") {
        pending.delete(mod.id);
        continue;
      }
      if (decision === "baseline") {
        lastApplied.set(mod.id, text);
        pending.delete(mod.id);
        continue;
      }
      if (decision === "arm") {
        pending.set(mod.id, text);
        continue;
      }

      pending.delete(mod.id);
      lastApplied.set(mod.id, text);
      try {
        await hotEvalMain(mod.id, text, sandkit);
        console.log(`reloaded ${mod.id}`);
      } catch (error) {
        console.error(`hot reload failed for ${mod.id}`, error);
      }
    }
  }

  async function loop(): Promise<void> {
    if (stopped) return;
    try {
      await tick();
    } catch (error) {
      console.error("hot reload poll failed", error);
    }
    if (!stopped) timer = setTimeout(() => void loop(), POLL_MS);
  }

  void loop();

  return () => {
    stopped = true;
    if (timer !== undefined) clearTimeout(timer);
  };
}
