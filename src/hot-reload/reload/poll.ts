/** Append a cache-buster so Electron does not reuse a stale `main.js`. */
export function cacheBust(url: string, now = Date.now()): string {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}t=${now}`;
}

export function isUsableSource(text: string): boolean {
  return text.trim().length > 0;
}

/** True when `next` is a new non-empty bundle compared to the last applied text. */
export function shouldReload(prev: string | undefined, next: string): boolean {
  if (!isUsableSource(next)) return false;
  return prev !== next;
}

export async function fetchMain(url: string): Promise<string | null> {
  try {
    const response = await fetch(cacheBust(url), { cache: "no-store" });
    if (!response.ok) return null;
    const text = await response.text();
    if (!isUsableSource(text)) return null;
    return text;
  } catch {
    return null;
  }
}
