import { onDispose } from "@modkit/debug";
import { modinfo } from "./mod";

const api = sandkit.api;

const INPUT_ID = `${modinfo.id}:raw-flake`;
const OUTPUT_ID = `${modinfo.id}:refined-flake`;
const STRUCTURE_ID = `${modinfo.id}:converter`;
const SPRITE_ID = `${modinfo.id}:converter-sprite`;
const BINDING_PAINT = `${modinfo.id}.paintInput`;

const INPUT_NAME_KEY = `${modinfo.id}.input.name`;
const OUTPUT_NAME_KEY = `${modinfo.id}.output.name`;
const STRUCTURE_NAME_KEY = `${modinfo.id}.structure.name`;

const STRUCTURE_SIZE = 4;
const PROCESS_INTERVAL_MS = 400;

const shape = Array.from({ length: STRUCTURE_SIZE }, () =>
  Array.from({ length: STRUCTURE_SIZE }, () => 1),
);

api.i18n.register("en", {
  [INPUT_NAME_KEY]: "Raw Flake",
  [OUTPUT_NAME_KEY]: "Refined Flake",
  [STRUCTURE_NAME_KEY]: "Flake Converter",
});

const { elementType: inputType } = api.elements.register({
  id: INPUT_ID,
  nameKey: INPUT_NAME_KEY,
  colors: {
    variants: [
      [255, 170, 80],
      [230, 130, 50],
      [200, 100, 40],
    ],
  },
  density: 160,
  matterType: sandkit.enums.MatterType.Powder,
});

const { elementType: outputType } = api.elements.register({
  id: OUTPUT_ID,
  nameKey: OUTPUT_NAME_KEY,
  colors: {
    variants: [
      [120, 210, 255],
      [80, 170, 230],
      [50, 130, 200],
    ],
  },
  density: 220,
  matterType: sandkit.enums.MatterType.Powder,
});

api.discoveries.addElementByType(inputType);
api.discoveries.addElementByType(outputType);

api.structures.register({
  id: STRUCTURE_ID,
  nameKey: STRUCTURE_NAME_KEY,
  buildModes: [{ type: "rectangular" }],
  shape,
  render: {
    imageName: SPRITE_ID,
    size: { width: 64, height: 64 },
  },
});

void api.sprites.loadFromMod(SPRITE_ID, "converter.png");

api.structures.addProcessor(STRUCTURE_ID, {
  intervalMs: PROCESS_INTERVAL_MS,
  process(_state, structure) {
    for (let dy = 0; dy < STRUCTURE_SIZE; dy += 1) {
      for (let dx = 0; dx < STRUCTURE_SIZE; dx += 1) {
        const cellX = structure.x + dx;
        const cellY = structure.y + dy;
        if (!api.elements.isTypeAtCell(cellX, cellY, inputType)) continue;
        api.elements.replaceAtCellWhenIdle(cellX, cellY, outputType);
        return;
      }
    }
  },
});

api.input.registerBinding(BINDING_PAINT, ["KeyF"], {
  displayName: "Paint Raw Flake",
  category: modinfo.name,
  handlers: {
    down: () => {
      const cell = api.input.getMouseCellPosition();
      api.elements.createAtCellWhenIdle(cell.x, cell.y, inputType);
    },
  },
});

const stopReady = api.events.on("game:ready", () => {
  api.player.buildings.unlockByType(STRUCTURE_ID);
  if (!reloaded) {
    api.ui.toast("Content Machine — build the Flake Converter from the hotbar", {});
  }
});

onDispose(stopReady);

console.log(
  `${reloaded ? "reloaded" : "loaded"} — ${STRUCTURE_ID} converts ${INPUT_ID} → ${OUTPUT_ID}`,
);
