/**
 * Shared engine API stub types.
 *
 * Used where `sandkit.engine.api` namespaces overlap the public mod API but are
 * not fully typed in declarations.
 *
 * @internal
 */

/** Stub for an unresolved engine method. @internal */
export type EngineFn = (...args: unknown[]) => unknown;

/**
 * Loose bag for namespaces that overlap `sandkit.api` (different names / state-first).
 * @internal
 */
export type EngineOverlapNs = Record<string, EngineFn | Record<string, unknown> | unknown>;
