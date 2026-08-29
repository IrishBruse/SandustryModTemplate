import { ELEMENT_DEFINITIONS } from "./definitions.ts";
import { ELEMENT, NAME_KEY } from "./ids.ts";

const api = sandkit.api;

export function registerElements(): void {
  api.i18n.register("en", {
    [NAME_KEY.pineSeed]: "Pine Seed",
    [NAME_KEY.pineShoot]: "Pine Shoot",
    [NAME_KEY.pineWood]: "Pine Wood",
    [NAME_KEY.pineNeedle]: "Pine Needle",
    [NAME_KEY.rawWood]: "Raw Wood",
    [NAME_KEY.charcoal]: "Charcoal",
    [NAME_KEY.leafDust]: "Leaf Dust",
  });

  for (const definition of ELEMENT_DEFINITIONS) {
    const { elementType } = api.elements.register(
      definition as Parameters<typeof api.elements.register>[0],
    );
    if (definition.flammable) {
      api.elements.addInteractionInfo(elementType, { kind: "flammable" });
      api.elements.updateDefinition(elementType, {
        flammable: definition.flammable,
      } as Parameters<typeof api.elements.updateDefinition>[1]);
    }
    if (definition.id !== ELEMENT.pineShoot) {
      api.discoveries.addElementByType(elementType);
    }
  }
}
