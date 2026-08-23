import { isEnabled } from "@modkit/utils";

const api = sandkit.api;
const { Tech } = sandkit.enums;

type HoveringPlayer = { isHovering: boolean };

function playerSnapshot(): HoveringPlayer | null {
  const store = sandkit.state.store as { player?: HoveringPlayer };
  return store.player ?? null;
}

function readMaxStepCells(): number {
  const value = api.settings.get("maxStepCells");
  if (typeof value !== "number" || !Number.isFinite(value)) return 2;
  return Math.min(8, Math.max(1, Math.floor(value)));
}

export function applySurvivalMovementRules(): void {
  if (!isEnabled(api)) return;

  api.tech.setLockedById(Tech.Hover, true);

  const player = playerSnapshot();
  if (player?.isHovering) {
    api.player.setMovementMode("normal");
  }
}

export function installMovementHooks(): () => void {
  const stopCollision = api.events.on("player:collision:prepare", (payload) => {
    if (!isEnabled(api)) return;
    payload.maxStepCells = readMaxStepCells();
  });

  const stopMoved = api.events.on("player:moved", () => {
    if (!isEnabled(api)) return;
    const player = playerSnapshot();
    if (player?.isHovering) {
      api.player.setMovementMode("normal");
    }
  });

  return () => {
    stopCollision();
    stopMoved();
  };
}
