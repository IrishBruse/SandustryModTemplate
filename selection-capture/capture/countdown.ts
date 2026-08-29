/** Wait `seconds` whole seconds; call `onSecond` at the start of each second. */
export async function waitCountdownSeconds(
  seconds: number,
  signal: AbortSignal | undefined,
  onSecond: (remaining: number) => void,
): Promise<"ok" | "cancelled"> {
  const total = Number.isFinite(seconds) ? Math.max(0, Math.round(seconds)) : 0;
  for (let left = total; left > 0; left--) {
    if (signal?.aborted) return "cancelled";
    onSecond(left);
    const cancelled = await sleepMs(1000, signal);
    if (cancelled) return "cancelled";
  }
  if (signal?.aborted) return "cancelled";
  return "ok";
}

function sleepMs(ms: number, signal: AbortSignal | undefined): Promise<boolean> {
  return new Promise((resolve) => {
    if (signal?.aborted) {
      resolve(true);
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve(false);
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      resolve(true);
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}
