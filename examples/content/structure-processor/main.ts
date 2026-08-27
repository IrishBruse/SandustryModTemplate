import { modinfo } from "./modinfo";

const api = sandkit.api;

const STRUCTURE_ID = `${modinfo.id}:scanner`;
const SPRITE_ID = `${modinfo.id}:scanner-sprite`;
const STRUCTURE_SIZE = 4;
const PROCESS_INTERVAL_MS = 1000;

const shape = Array.from({ length: STRUCTURE_SIZE }, () =>
  Array.from({ length: STRUCTURE_SIZE }, () => 1),
);

async function main() {
  await api.sprites.loadFromMod(SPRITE_ID, "processor.png");

  api.structures.register({
    id: STRUCTURE_ID,
    name: "Example Scanner",
    categoryKey: "logistics",
    buildModes: [{ type: "rectangular" }],
    shape,
    render: {
      imageName: SPRITE_ID,
      size: { width: 64, height: 64 },
    },
  });

  api.structures.processing.register(STRUCTURE_ID, {
    structureType: STRUCTURE_ID,
    intervalMs: PROCESS_INTERVAL_MS,
    process(structure, context) {
      let filled = 0;
      for (let dy = 0; dy < STRUCTURE_SIZE; dy += 1) {
        for (let dx = 0; dx < STRUCTURE_SIZE; dx += 1) {
          if (!context.isCellEmptyAtCell(structure.x + dx, structure.y + dy)) {
            filled += 1;
          }
        }
      }
      console.log(
        `structure processor — (${structure.x}, ${structure.y}) ${filled}/${STRUCTURE_SIZE * STRUCTURE_SIZE} cells occupied`,
      );
    },
  });

  api.ui.toast("Structure Processor — Debug → Building → Example Scanner", {});
  console.log(
    `loaded — structures.processing.register(${STRUCTURE_ID}) every ${PROCESS_INTERVAL_MS}ms`,
  );
}

void main();
