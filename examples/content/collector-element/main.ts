import { modinfo } from "./modinfo";

const api = sandkit.api;

const ELEMENT_ID = `${modinfo.id}:platinum`;
const NAME_KEY = `${modinfo.id}.element.name`;
const BINDING_PAINT = `${modinfo.id}.paint`;

/** Collector payout — Gold is hardcoded to 1; Platinum pays 2 like liquidGold. */
const COLLECTABLE_VALUE = 2;

api.i18n.register("en", {
  [NAME_KEY]: "Platinum",
});

// Gold-like Solid element with a collectable value (required for mod types).
const { elementType } = api.elements.register({
  id: ELEMENT_ID,
  nameKey: NAME_KEY,
  interactions: [
    { kind: "structure", structures: [sandkit.enums.StructureType.Collector] },
    { kind: "structure", structures: ["smelter"] },
  ],
  density: 300,
  matterType: sandkit.enums.MatterType.Solid,
  metaColor: 0xd3e5ef,
  colors: {
    variants: [
      [211, 229, 239],
      [180, 200, 220],
      [160, 180, 200],
    ],
  },
  collectable: { value: COLLECTABLE_VALUE },
} as Parameters<typeof api.elements.register>[0]);

api.elements.updateDefinition(elementType, {
  collectable: { value: COLLECTABLE_VALUE },
} as Parameters<typeof api.elements.updateDefinition>[1]);

api.discoveries.addElementByType(elementType);

api.input.registerBinding(BINDING_PAINT, ["KeyP"], {
  displayName: "Paint Platinum",
  category: modinfo.name,
  handlers: {
    down: () => {
      const cell = api.input.getMouseCellPosition();
      api.elements.createAtCellWhenIdle(cell.x, cell.y, elementType);
    },
  },
});

api.ui.toast("Platinum — Debug → Element → Elements, or press P", {});

console.log(
  `Collector element — ${ELEMENT_ID} type ${elementType}, value ${api.collector.getValueByType(elementType)}`,
);
