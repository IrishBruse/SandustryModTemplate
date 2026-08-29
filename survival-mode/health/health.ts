import { isEnabled } from "@modkit/utils";
import { modinfo } from "../modinfo";
import { HEALTH_MAX, resolveStoredHealth } from "./storedHealth";

const BINDING_DEBUG_HEAL = `${modinfo.id}.debugHeal`;

export { HEALTH_MAX } from "./storedHealth";
const STORAGE_KEY = "health";

let health = HEALTH_MAX;

function clampHealth(value: number): number {
  return Math.min(HEALTH_MAX, Math.max(0, Math.round(value)));
}

function isNewGameBoot(): boolean {
  return new URLSearchParams(window.location.search).has("new_game");
}

export function getHealth(): number {
  return health;
}

export function setHealth(value: number): void {
  health = clampHealth(value);
  sandkit.api.storage.set(modinfo.id, STORAGE_KEY, health);
}

/** Reduce health by `amount`. Returns the new value. */
export function applyDamage(amount: number): number {
  if (amount <= 0) return health;
  setHealth(health - amount);
  return health;
}

export function loadHealth(): void {
  if (isNewGameBoot()) {
    health = HEALTH_MAX;
    sandkit.api.storage.set(modinfo.id, STORAGE_KEY, health);
    return;
  }

  const stored = sandkit.api.storage.get(modinfo.id, STORAGE_KEY);
  health = resolveStoredHealth(stored);
  if (stored !== health) {
    sandkit.api.storage.set(modinfo.id, STORAGE_KEY, health);
  }
}

export function formatHealth(value = health): string {
  return `${value}/${HEALTH_MAX}`;
}

/** Bind **H** to restore health to {@link HEALTH_MAX} (debug). */
export function installDebugHealBinding(): void {
  sandkit.api.input.registerBinding(BINDING_DEBUG_HEAL, ["KeyH"], {
    displayName: "Debug restore health",
    category: modinfo.name,
    handlers: {
      down: () => {
        if (!isEnabled(sandkit.api)) return;
        setHealth(HEALTH_MAX);
      },
    },
  });
}
