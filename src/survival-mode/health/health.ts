import { isEnabled } from "@modkit/utils";
import { modinfo } from "../mod";

const BINDING_DEBUG_HEAL = `${modinfo.id}.debugHeal`;

export const HEALTH_MAX = 100;
const STORAGE_KEY = "health";

let health = HEALTH_MAX;

function clampHealth(value: number): number {
  return Math.min(HEALTH_MAX, Math.max(0, Math.round(value)));
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
  const stored = sandkit.api.storage.get(modinfo.id, STORAGE_KEY);
  if (typeof stored === "number" && Number.isFinite(stored)) {
    health = clampHealth(stored);
    return;
  }
  health = HEALTH_MAX;
  sandkit.api.storage.set(modinfo.id, STORAGE_KEY, health);
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
