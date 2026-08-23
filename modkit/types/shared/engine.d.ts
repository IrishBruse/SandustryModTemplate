/**
 * Shared engine API stub types.
 *
 * @internal
 */

/** Stub for an unresolved engine method. @internal */
export type EngineFn = (...args: unknown[]) => unknown;

/** Loose bag for namespaces that overlap `sandkit.api` (different names / state-first). @internal */
export type EngineOverlapNs = Record<string, EngineFn | Record<string, unknown> | unknown>;
