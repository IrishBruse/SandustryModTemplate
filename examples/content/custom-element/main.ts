import { modinfo } from "./mod";

const api = sandkit.api;

const ELEMENT_ID = `${modinfo.id}:spark-dust`;
const NAME_KEY = `${modinfo.id}.element.name`;
const BINDING_PAINT = `${modinfo.id}.paint`;

api.i18n.register("en", {
  [NAME_KEY]: "Spark Dust",
});

const { elementType } = api.elements.register({
  id: ELEMENT_ID,
  nameKey: NAME_KEY,
  colors: {
    variants: [
      [255, 180, 60],
      [255, 140, 40],
      [220, 100, 30],
    ],
  },
  density: 180,
  matterType: sandkit.enums.MatterType.Powder,
});

api.discoveries.addElementByType(elementType);

api.input.registerBinding(BINDING_PAINT, ["KeyP"], {
  displayName: "Paint Spark Dust",
  category: modinfo.name,
  handlers: {
    down: () => {
      const cell = api.input.getMouseCellPosition();
      api.elements.createAtCellWhenIdle(cell.x, cell.y, elementType);
    },
  },
});

api.ui.toast("Custom Element loaded — press P at the mouse cell", {});

console.log(`loaded — ${ELEMENT_ID} type ${elementType}, binding ${BINDING_PAINT}`);
