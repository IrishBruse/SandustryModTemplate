/**
 * `sandkit.state` / `sandkit.engine.state` (same object at runtime).
 *
 * Shapes below are stubs — refine fields as they are confirmed.
 */
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
