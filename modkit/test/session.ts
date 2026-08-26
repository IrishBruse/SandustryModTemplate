import { readFileSync, writeFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";
import { CdpConnection } from "./cdp.ts";
import { installedModMain, tryReadInstalledModMain } from "./paths.ts";
import { toPageExpression } from "./serialize.ts";
import { waitFor, type WaitForOptions } from "./wait.ts";

export type ModMainFile = {
  path: string;
  original: string;
  readonly text: string;
  write(next: string): void;
  replaceAll(search: string, replacement: string): void;
};

export type SessionWaitForOptions<TArgs extends unknown[] = unknown[]> = WaitForOptions & {
  args?: TArgs;
};

export class SandustrySession {
  private readonly cdp: CdpConnection;

  private constructor(cdp: CdpConnection) {
    this.cdp = cdp;
  }

  static async connect(options?: { port?: string; timeoutMs?: number }): Promise<SandustrySession> {
    return new SandustrySession(await CdpConnection.connect(options));
  }

  /**
   * Connect and wait until `sandkit` is in the Game scene. Retries after auto-load navigation.
   */
  static async connectReady(options?: {
    port?: string;
    timeoutMs?: number;
  }): Promise<SandustrySession> {
    const timeoutMs = options?.timeoutMs ?? 45000;
    const deadline = Date.now() + timeoutMs;
    let lastError = "Sandustry renderer not ready";
    while (Date.now() < deadline) {
      let session: SandustrySession | undefined;
      try {
        session = await SandustrySession.connect(options);
        const state = await session.evaluate(() => {
          const sandkit = (
            globalThis as typeof globalThis & {
              sandkit?: {
                api?: unknown;
                enums?: { Scene?: { Game?: number } };
                engine?: { state?: { store?: { scene?: { active?: number } } } };
              };
            }
          ).sandkit;
          return {
            api: Boolean(sandkit && sandkit.api),
            scene: sandkit?.engine?.state?.store?.scene?.active ?? null,
            game: sandkit?.enums?.Scene?.Game ?? null,
          };
        });
        if (state.api && state.game != null && state.scene === state.game) return session;
        lastError = "Sandustry is not in the Game scene";
        session.close();
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
        session?.close();
      }
      await sleep(250);
    }
    throw new Error(lastError);
  }

  close(): void {
    this.cdp.close();
  }

  /**
   * Run `fn` in the Sandustry renderer. Pass JSON values as extra arguments.
   * Closures do not capture Node locals.
   */
  async evaluate<TArgs extends unknown[], TResult>(
    fn: (...args: TArgs) => TResult | Promise<TResult>,
    ...args: TArgs
  ): Promise<TResult> {
    return (await this.cdp.evaluate(toPageExpression(fn, args))) as TResult;
  }

  /**
   * Poll a page function until `match` is true. `match` runs in Node.
   */
  async waitFor<TArgs extends unknown[], T>(
    read: (...args: TArgs) => T | Promise<T>,
    match: (value: T) => boolean,
    options?: SessionWaitForOptions<TArgs>,
  ): Promise<T> {
    const pageArgs = (options?.args ?? []) as TArgs;
    return waitFor(() => this.evaluate(read, ...pageArgs), match, options);
  }

  tryReadModMain(modId: string): string | null {
    return tryReadInstalledModMain(modId);
  }

  /**
   * Edit the installed `main.js` for `modId`, then restore the original bytes.
   */
  async withModMain(modId: string, fn: (file: ModMainFile) => Promise<void> | void): Promise<void> {
    const path = installedModMain(modId);
    const original = readFileSync(path, "utf8");
    let current = original;
    const file: ModMainFile = {
      path,
      original,
      get text() {
        return current;
      },
      write(next: string) {
        current = next;
        writeFileSync(path, next);
      },
      replaceAll(search: string, replacement: string) {
        file.write(file.text.replaceAll(search, replacement));
      },
    };
    try {
      await fn(file);
    } finally {
      writeFileSync(path, original);
    }
  }
}
