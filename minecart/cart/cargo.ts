import { MAX_CARGO } from "../constants.ts";

export function cargoCount(cargo: Record<string, number>): number {
  let total = 0;
  for (const amount of Object.values(cargo)) total += amount;
  return total;
}

export function cargoHasRoom(cargo: Record<string, number>, extra = 1): boolean {
  return cargoCount(cargo) + extra <= MAX_CARGO;
}

export function addCargo(cargo: Record<string, number>, elementType: number, amount = 1): boolean {
  if (!cargoHasRoom(cargo, amount)) return false;
  const key = String(elementType);
  cargo[key] = (cargo[key] ?? 0) + amount;
  return true;
}

export function takeCargo(cargo: Record<string, number>): number | null {
  for (const [key, amount] of Object.entries(cargo)) {
    if (amount <= 0) continue;
    cargo[key] = amount - 1;
    if (cargo[key] <= 0) delete cargo[key];
    return Number(key);
  }
  return null;
}
