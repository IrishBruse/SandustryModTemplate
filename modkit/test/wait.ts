export type WaitForOptions = {
  timeoutMs?: number;
  intervalMs?: number;
  message?: string;
};

const DEFAULT_TIMEOUT_MS = 8000;
const DEFAULT_INTERVAL_MS = 250;

/**
 * Poll `read` until `match` is true. `read` runs in the caller (Node or a
 * session wrapper). `match` always runs in Node.
 */
export async function waitFor<T>(
  read: () => Promise<T>,
  match: (value: T) => boolean,
  options?: WaitForOptions,
): Promise<T> {
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const intervalMs = options?.intervalMs ?? DEFAULT_INTERVAL_MS;
  const deadline = Date.now() + timeoutMs;
  let last: T | undefined;
  while (Date.now() < deadline) {
    last = await read();
    if (match(last)) return last;
    const remaining = deadline - Date.now();
    if (remaining <= 0) break;
    await new Promise((resolve) => setTimeout(resolve, Math.min(intervalMs, remaining)));
  }
  const label = options?.message ?? "waitFor timed out";
  throw new Error(`${label}: last value ${stringifyLast(last)}`);
}

function stringifyLast(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}
