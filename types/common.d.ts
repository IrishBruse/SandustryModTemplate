/**
 * Shared primitives for Sandkit API typings.
 *
 * ## Context
 *
 * The public mod API (`api.*` in main.js) binds context internally — you do
 * not pass `ctx` as the first argument. Generated stubs in `api/generated/`
 * use mod-facing arity (`Method0`, `Method1`, …).
 *
 * Mod settings from `configSchema` are read via `api.settings.get(...)`.
 * Read-only game config uses `api.gameConfig`.
 *
 * ## Timing and lifecycle
 *
 * - Do not assume `session.externalMods` exists at mod entry time.
 * - Mods execute when the first world loads.
 * - Use `api.events.on("game:ready", ...)` for setup that needs live game state.
 * - Add a safe fallback timer only if the event may have already fired.
 * - If UI depends on late data, fetch on first panel open, not at load.
 *
 * ## Thread rules
 *
 * | Thread | Mutation style |
 * |---|---|
 * | Main (`main.js`) | `runWhenSimulationIdle`, `*WhenIdle`, `removeAtDeferred`, `moveAtSimulationIdle` |
 * | Worker (`worker.js`) | Immediate: `createAt`, `removeAt`, `move`, `setCellId` |
 *
 * ## Defensive coding
 *
 * - Prefer Sandkit API before `sandkit.engine` internals.
 * - Keep one `safe(fn, fallback)` helper for risky calls.
 * - For async bridge calls, return `null` on failure — never throw to caller.
 * - Never let one failing feature break the full mod.
 * - Log errors with a mod tag prefix (e.g. `[my-mod]`).
 *
 * @example
 * ```js
 * const safe = (fn, fallback = null) => {
 *   try { return fn(); } catch { return fallback; }
 * };
 * ```
 */

/** Game context passed into most Sandkit API calls (main thread). */
export type Ctx = unknown;

/** Worker-side context when running in worker.js. */
export type WorkerCtx = unknown;

export interface CellPos {
  x: number;
  y: number;
}

export interface CellRect extends CellPos {
  width: number;
  height: number;
}

export interface Direction {
  x: number;
  y: number;
}

/** Loose record for structure/element payloads and mod-defined data bags. */
export type DataBag = Record<string, unknown>;

/** Handler used across events, hooks, and triggers. */
export type ApiHandler = (...args: unknown[]) => unknown;

/** Registration defs are mod-specific; keep them open. */
export type RegistrationDef = Record<string, unknown>;

/** Callback receiving structure instances from forEachOfType and similar. */
export type StructureCallback = (structure: StructureRef) => void;

/** Opaque structure reference returned by structure queries. */
export interface StructureRef {
  x: number;
  y: number;
  type?: string;
  [key: string]: unknown;
}

/** Build ctx-first arity stubs from runtime dump parameter counts. */
export type CtxMethod0 = (ctx: Ctx) => unknown;
export type CtxMethod1 = (ctx: Ctx, a: unknown) => unknown;
export type CtxMethod2 = (ctx: Ctx, a: unknown, b: unknown) => unknown;
export type CtxMethod3 = (ctx: Ctx, a: unknown, b: unknown, c: unknown) => unknown;
export type CtxMethod4 = (ctx: Ctx, a: unknown, b: unknown, c: unknown, d: unknown) => unknown;
export type CtxMethod5 = (ctx: Ctx, a: unknown, b: unknown, c: unknown, d: unknown, e: unknown) => unknown;
export type CtxMethod6 = (ctx: Ctx, a: unknown, b: unknown, c: unknown, d: unknown, e: unknown, f: unknown) => unknown;
export type CtxMethod7 = (ctx: Ctx, a: unknown, b: unknown, c: unknown, d: unknown, e: unknown, f: unknown, g: unknown) => unknown;

export type Method0 = () => unknown;
export type Method1 = (a: unknown) => unknown;
export type Method2 = (a: unknown, b: unknown) => unknown;
export type Method3 = (a: unknown, b: unknown, c: unknown) => unknown;
export type Method4 = (a: unknown, b: unknown, c: unknown, d: unknown) => unknown;
export type Method5 = (a: unknown, b: unknown, c: unknown, d: unknown, e: unknown) => unknown;
export type Method6 = (a: unknown, b: unknown, c: unknown, d: unknown, e: unknown, f: unknown) => unknown;

/** Pick a ctx-first function type from a runtime arity (best-effort). */
export type ByArity<N extends number> = N extends 0
  ? Method0
  : N extends 1
    ? CtxMethod0
    : N extends 2
      ? CtxMethod1
      : N extends 3
        ? CtxMethod2
        : N extends 4
          ? CtxMethod3
          : N extends 5
            ? CtxMethod4
            : N extends 6
              ? CtxMethod5
              : N extends 7
                ? CtxMethod6
                : ApiHandler;
