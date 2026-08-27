const api = sandkit.api;

const sandType = api.elements.getTypeById("sand");
const waterType = api.elements.getTypeById("water");
const wetSandType = api.elements.getTypeById("wetSand");

api.reactions.registerContact({
  inputA: sandType,
  inputB: waterType,
  outputA: wetSandType,
  outputB: null,
  orientation: "any",
});

api.ui.toast("Element Reaction — sand + water contact registered", {});

console.log("loaded — reactions.registerContact(sand + water → wetSand)");
