import modinfo from "./modinfo.json";

const api = sandkit.api;

const ELEMENT_ID = `${modinfo.id}:spark-dust`;
const NAME_KEY = `${modinfo.id}.element.name`;

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

api.ui.toast("Custom Element — Debug → Element → Spark Dust", {});

console.log(`loaded — elements.register(${ELEMENT_ID}) type ${elementType}`);
