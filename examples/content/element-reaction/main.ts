const api = sandkit.api;

const sandType = api.elements.getTypeFromId("sand");
const waterType = api.elements.getTypeFromId("water");
const wetSandType = api.elements.getTypeFromId("wetSand");

api.reactions.registerContact({
  inputA: sandType,
  inputB: waterType,
  outputA: wetSandType,
  outputB: null,
  orientation: "any",
});

api.ui.toast("Element Reaction — sand + water contact registered", {});

console.log("loaded — reactions.registerContact(sand + water → wetSand)");
