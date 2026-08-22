import { safe } from "@modkit/utils";

type SessionWithAutosave = {
  settings?: { autosaveInterval?: number };
};

/**
 * Turn off the session autosave timer. Manual saves still work.
 * Game treats `0` as off (`if (!autosaveInterval) return`).
 */
export function disableSessionAutosave(): void {
  safe(() => {
    const session = sandkit.state.session as SessionWithAutosave | undefined;
    if (!session?.settings) return;
    session.settings.autosaveInterval = 0;
  });
}
