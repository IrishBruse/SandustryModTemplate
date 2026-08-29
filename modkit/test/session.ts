import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { CdpConnection, type ScreenshotClip } from "./cdp.ts";
import { installedModMain, tryReadInstalledModMain } from "./paths.ts";
import {
  formatRendererReadySnapshot,
  GAME_READY_POLL_MS,
  GAME_READY_TIMEOUT_MS,
  isRendererReady,
  readRendererReadySnapshot,
} from "./readiness.ts";
import { toPageExpression } from "./serialize.ts";
import { waitFor, type WaitForOptions } from "./helpers/wait.ts";
import {
  buildLayout,
  buildStructures,
  runSimulation,
  setSimulationPaused,
  type ElementSeed,
  type StructureLayout,
  type StructureLayoutPhase,
  type StructureLayoutSymbol,
  type StructurePlacement,
} from "../../test/helpers/world.ts";

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

export type {
  ElementSeed,
  StructureLayout,
  StructureLayoutPhase,
  StructureLayoutSymbol,
  StructurePlacement,
} from "../../test/helpers/world.ts";

export type { ScreenshotClip };

export type ScreenshotOptions = {
  clip?: ScreenshotClip;
  selector?: string;
  mask?: string[];
  path?: string;
  animations?: "disabled" | "allow";
};

const SCREENSHOT_MASK_ID = "__modkit-screenshot-mask";

export class SandustrySession {
  private readonly cdp: CdpConnection;

  private constructor(cdp: CdpConnection) {
    this.cdp = cdp;
  }

  static async connect(options?: { port?: string; timeoutMs?: number }): Promise<SandustrySession> {
    return new SandustrySession(await CdpConnection.connect(options));
  }

  /**
   * Connect and wait until the save has finished booting: Game scene, `game:ready`,
   * and the `#loading` overlay removed. Retries after auto-load navigation.
   */
  static async connectReady(options?: {
    port?: string;
    timeoutMs?: number;
  }): Promise<SandustrySession> {
    const timeoutMs = options?.timeoutMs ?? GAME_READY_TIMEOUT_MS;
    const deadline = Date.now() + timeoutMs;
    let lastError = "Sandustry renderer not ready";
    while (Date.now() < deadline) {
      let session: SandustrySession | undefined;
      try {
        session = await SandustrySession.connect(options);
        const snapshot = await session.evaluate(readRendererReadySnapshot);
        if (isRendererReady(snapshot)) {
          return session;
        }
        lastError = `Sandustry boot is not finished: ${formatRendererReadySnapshot(snapshot)}`;
        session.close();
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
        session?.close();
      }
      await sleep(GAME_READY_POLL_MS);
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

  /** Build several structures in one renderer turn and wait for their anchors. */
  async buildStructures(placements: readonly StructurePlacement[]): Promise<void> {
    await buildStructures(this, placements);
  }

  /** Build a readable 4-cell-grid fixture, optionally in explicit phases. */
  async buildLayout(layout: StructureLayout): Promise<void> {
    await buildLayout(this, layout);
  }

  /** Pause or resume the simulation without opening the in-game pause UI. */
  async setSimulationPaused(paused: boolean): Promise<void> {
    await setSimulationPaused(this, paused);
  }

  async pauseSimulation(): Promise<void> {
    await this.setSimulationPaused(true);
  }

  async resumeSimulation(): Promise<void> {
    await this.setSimulationPaused(false);
  }

  /** Run the simulation for a wall-clock interval, then restore its prior state. */
  async runSimulation(durationMs: number): Promise<void> {
    await runSimulation(this, durationMs);
  }

  /** Return `manifest.id` values from the live ordered mod list. */
  async orderedModIds(): Promise<string[]> {
    return this.evaluate(() => {
      const session = (
        sandkit.engine.state as {
          session?: { externalMods?: { orderedMods?: Array<{ manifest?: { id?: string } }> } };
        }
      ).session;
      const ordered = session?.externalMods?.orderedMods ?? [];
      return ordered
        .map((entry) => entry?.manifest?.id)
        .filter((id): id is string => typeof id === "string");
    });
  }

  /**
   * Capture the compositor as a PNG. Default `animations: "disabled"` pauses the
   * sim without opening the pause menu, then waits two animation frames.
   */
  async screenshot(options?: ScreenshotOptions): Promise<Buffer> {
    const animations = options?.animations ?? "disabled";
    let restorePause: (() => Promise<void>) | undefined;
    let masked = false;
    try {
      if (animations === "disabled") restorePause = await this.freezeSim();
      if (options?.mask && options.mask.length > 0) {
        await this.applyMasks(options.mask);
        masked = true;
      }
      const clip = await this.resolveClip(options);
      const png = await this.cdp.captureScreenshot(clip);
      if (options?.path) {
        mkdirSync(dirname(options.path), { recursive: true });
        writeFileSync(options.path, png);
      }
      return png;
    } finally {
      if (masked) {
        try {
          await this.removeMasks();
        } catch {
          /* still restore pause */
        }
      }
      await restorePause?.();
    }
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

  private async freezeSim(): Promise<() => Promise<void>> {
    const prior = await this.evaluate(() => {
      const session = (
        globalThis as typeof globalThis & {
          sandkit?: { engine?: { state?: { session?: { paused?: boolean } } } };
        }
      ).sandkit?.engine?.state?.session;
      const paused = Boolean(session?.paused);
      if (session) session.paused = true;
      return { hadSession: Boolean(session), paused };
    });
    const restore = async () => {
      if (!prior.hadSession) return;
      await this.evaluate((paused: boolean) => {
        const session = (
          globalThis as typeof globalThis & {
            sandkit?: { engine?: { state?: { session?: { paused?: boolean } } } };
          }
        ).sandkit?.engine?.state?.session;
        if (session) session.paused = paused;
      }, prior.paused);
    };
    // Prefer timers over rAF: pausing the sim can stop the page animation
    // frame loop, so double-rAF never resolves and CDP awaitPromise hangs.
    try {
      await this.evaluate(
        () =>
          new Promise<void>((resolve) => {
            setTimeout(resolve, 32);
          }),
      );
    } catch (error) {
      await restore();
      throw error;
    }
    return restore;
  }

  private async resolveClip(options?: ScreenshotOptions): Promise<ScreenshotClip | undefined> {
    if (!options?.selector) return options?.clip;
    const box = await this.evaluate((selector: string) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    }, options.selector);
    if (!box || box.width <= 0 || box.height <= 0) {
      throw new Error(`screenshot selector did not match a visible element: ${options.selector}`);
    }
    if (!options.clip) return box;
    return {
      x: box.x + options.clip.x,
      y: box.y + options.clip.y,
      width: options.clip.width,
      height: options.clip.height,
    };
  }

  private async applyMasks(selectors: string[]): Promise<void> {
    await this.evaluate(
      (sels: string[], rootId: string) => {
        document.getElementById(rootId)?.remove();
        const root = document.createElement("div");
        root.id = rootId;
        root.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:2147483647;";
        for (const sel of sels) {
          for (const el of document.querySelectorAll(sel)) {
            const r = el.getBoundingClientRect();
            const box = document.createElement("div");
            box.style.cssText = `position:absolute;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;background:#FF00FF;`;
            root.appendChild(box);
          }
        }
        document.documentElement.appendChild(root);
      },
      selectors,
      SCREENSHOT_MASK_ID,
    );
  }

  private async removeMasks(): Promise<void> {
    await this.evaluate((rootId: string) => {
      document.getElementById(rootId)?.remove();
    }, SCREENSHOT_MASK_ID);
  }
}
