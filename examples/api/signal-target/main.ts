const api = sandkit.api;

const HEAT_CANNON_TYPES = [
  "heatCannonUp",
  "heatCannonDown",
  "heatCannonLeft",
  "heatCannonRight",
] as const;

function applySignalInput(structure: unknown, input: unknown) {
  const s = structure as { x: number; y: number };
  const payload = input as { inputCount?: number; combined?: boolean };
  api.structures.processing.setEnabledAtCell(
    s.x,
    s.y,
    payload.inputCount === 0 || payload.combined === true,
  );
}

for (const structureType of HEAT_CANNON_TYPES) {
  api.signals.targets.register(structureType, applySignalInput);
}

console.log(`loaded — signals.targets.register for ${HEAT_CANNON_TYPES.length} heat cannons`);
