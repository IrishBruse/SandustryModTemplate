/**
 * `sandkit.engine.state` — live game state object.
 *
 * Same object as `sandkit.state` at runtime. **Internal API.** Prefer
 * {@link sandkit.api} when a public method exists. Shapes below are stubs;
 * refine fields as they are confirmed.
 *
 * @internal
 */

/** Live game state exposed on `sandkit.engine.state`. @internal */
export type SandkitState = {
  environment: {
    context: number;
    multithreading: unknown;
    readonly [key: string]: unknown;
  };
  sandkit: {
    events: unknown;
    gameReady: boolean;
    graphics: unknown;
    hooks: unknown;
    keyBindings: unknown;
    mods: unknown;
    registeredLauncherTypes: unknown;
    readonly [key: string]: unknown;
  };
  session: unknown;
  shared: unknown;
  store: unknown;
};
