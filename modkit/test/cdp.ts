import {
  SANDUSTRY_TEST_CDP_PORT,
  SANDUSTRY_TEST_VIEWPORT_HEIGHT,
  SANDUSTRY_TEST_VIEWPORT_WIDTH,
} from "./paths.ts";

export type ScreenshotClip = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** Isolated integration Chromium CDP. F5 / Steam debug stays on :9222. */
export const SANDUSTRY_CDP_PORT = SANDUSTRY_TEST_CDP_PORT;

const DEFAULT_TIMEOUT_MS = 8000;

export async function isSandustryAvailable(port = SANDUSTRY_CDP_PORT): Promise<boolean> {
  try {
    const response = await fetch(`http://127.0.0.1:${port}/json/version`, {
      signal: AbortSignal.timeout(1500),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function pageWebSocketUrl(port: string): Promise<string> {
  const response = await fetch(`http://127.0.0.1:${port}/json/list`, {
    signal: AbortSignal.timeout(2000),
  });
  if (!response.ok) throw new Error(`CDP /json failed: ${response.status}`);
  const targets = await response.json();
  if (!Array.isArray(targets)) throw new Error("CDP /json is not a list");
  const page = targets.find(
    (entry) =>
      entry &&
      typeof entry === "object" &&
      entry.type === "page" &&
      typeof entry.webSocketDebuggerUrl === "string" &&
      typeof entry.url === "string" &&
      (entry.url.includes("127.0.0.1") || /Sandustry/i.test(String(entry.title ?? ""))),
  );
  if (!page) throw new Error("No integration test page on CDP");
  return page.webSocketDebuggerUrl;
}

type Pending = {
  resolve: (value: unknown) => void;
  reject: (error: Error) => void;
  timer: ReturnType<typeof setTimeout>;
};

export class CdpConnection {
  private nextId = 1;
  private tail: Promise<unknown> = Promise.resolve();
  private readonly pending = new Map<number, Pending>();
  private readonly ws: WebSocket;
  private readonly timeoutMs: number;

  private constructor(ws: WebSocket, timeoutMs: number) {
    this.ws = ws;
    this.timeoutMs = timeoutMs;
    ws.addEventListener("message", (event) => this.onMessage(event));
    ws.addEventListener("close", () => this.rejectAll(new Error("CDP closed")));
  }

  static async connect(options?: { port?: string; timeoutMs?: number }): Promise<CdpConnection> {
    const port = options?.port ?? SANDUSTRY_CDP_PORT;
    const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const wsUrl = await pageWebSocketUrl(port);
    const ws = new WebSocket(wsUrl);
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("CDP websocket timeout")), timeoutMs);
      ws.addEventListener("open", () => {
        clearTimeout(timer);
        resolve();
      });
      ws.addEventListener("error", () => {
        clearTimeout(timer);
        reject(new Error("CDP websocket error"));
      });
    });
    return new CdpConnection(ws, timeoutMs);
  }

  async evaluate(expression: string): Promise<unknown> {
    const details = (await this.sendQueued("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    })) as {
      exceptionDetails?: { exception?: { description?: string }; text?: string };
      result?: { value?: unknown };
    };
    const exception = details.exceptionDetails;
    if (exception) {
      throw new Error(exception.exception?.description || exception.text || "CDP exception");
    }
    return details.result?.value;
  }

  /**
   * Lock the page to a fixed size once at host boot.
   * Visible windows use Browser bounds only — Emulation device metrics resize the
   * window and make `:view` thrash. Headless uses device metrics so screenshots
   * stay 1280×720.
   */
  async lockViewport(options?: {
    visible?: boolean;
    width?: number;
    height?: number;
  }): Promise<void> {
    const width = options?.width ?? SANDUSTRY_TEST_VIEWPORT_WIDTH;
    const height = options?.height ?? SANDUSTRY_TEST_VIEWPORT_HEIGHT;
    if (options?.visible === true) {
      await this.setWindowBounds(width, height);
      return;
    }
    await this.sendQueued("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: false,
    });
  }

  private async setWindowBounds(width: number, height: number): Promise<void> {
    const target = (await this.sendQueued("Browser.getWindowForTarget", {})) as {
      windowId?: number;
    };
    if (typeof target.windowId !== "number") return;
    await this.sendQueued("Browser.setWindowBounds", {
      windowId: target.windowId,
      bounds: {
        width,
        height,
        windowState: "normal",
      },
    });
  }

  async captureScreenshot(clip?: ScreenshotClip): Promise<Buffer> {
    const params: Record<string, unknown> = {
      format: "png",
      fromSurface: true,
    };
    if (clip) {
      params.clip = {
        x: Math.round(clip.x),
        y: Math.round(clip.y),
        width: Math.max(1, Math.round(clip.width)),
        height: Math.max(1, Math.round(clip.height)),
        scale: 1,
      };
    }
    const result = (await this.sendQueued("Page.captureScreenshot", params)) as { data?: string };
    if (typeof result?.data !== "string") {
      throw new Error("CDP screenshot returned no data");
    }
    return Buffer.from(result.data, "base64");
  }

  close(): void {
    this.ws.close();
  }

  private sendQueued(method: string, params: Record<string, unknown>): Promise<unknown> {
    const run = this.tail.then(() => this.send(method, params));
    this.tail = run.then(
      () => undefined,
      () => undefined,
    );
    return run;
  }

  private send(method: string, params: Record<string, unknown>): Promise<unknown> {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error("CDP timeout"));
      }, this.timeoutMs);
      this.pending.set(id, { resolve, reject, timer });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  private onMessage(event: MessageEvent): void {
    let msg: { id?: number; error?: { message?: string }; result?: unknown };
    try {
      msg = JSON.parse(String(event.data));
    } catch {
      return;
    }
    if (typeof msg.id !== "number") return;
    const pending = this.pending.get(msg.id);
    if (!pending) return;
    this.pending.delete(msg.id);
    clearTimeout(pending.timer);
    if (msg.error) {
      pending.reject(new Error(msg.error.message || "CDP error"));
      return;
    }
    pending.resolve(msg.result);
  }

  private rejectAll(error: Error): void {
    for (const pending of this.pending.values()) {
      clearTimeout(pending.timer);
      pending.reject(error);
    }
    this.pending.clear();
  }
}
