/**
 * Composed main-thread `sandkit.api` object.
 *
 * Namespace members are documented under {@link sandkit.api}. Use this type
 * when typing the host `sandkit.api` value as a whole.
 */
export type SandkitApi = {
  action: typeof import("./action").action;
  assets: typeof import("./assets").assets;
  authorization: typeof import("./authorization").authorization;
  building: typeof import("./building").building;
  camera: typeof import("./camera").camera;
  collector: typeof import("./collector").collector;
  constants: typeof import("./constants").constants;
  cooldown: typeof import("./cooldown").cooldown;
  discoveries: typeof import("./discoveries").discoveries;
  effects: typeof import("./effects").effects;
  elements: typeof import("./elements").elements;
  energy: typeof import("./energy").energy;
  events: typeof import("./events").events;
  excavation: typeof import("./excavation").excavation;
  fire: typeof import("./fire").fire;
  gameConfig: typeof import("./gameconfig").gameConfig;
  grid: typeof import("./grid").grid;
  hooks: typeof import("./hooks").hooks;
  i18n: typeof import("./i18n").i18n;
  input: typeof import("./input").input;
  items: typeof import("./items").items;
  lights: typeof import("./lights").lights;
  maps: typeof import("./maps").maps;
  mods: typeof import("./mods").mods;
  patterns: typeof import("./patterns").patterns;
  player: typeof import("./player").player;
  processing: typeof import("./processing").processing;
  progression: typeof import("./progression").progression;
  projectiles: typeof import("./projectiles").projectiles;
  random: typeof import("./random").random;
  raycast: typeof import("./raycast").raycast;
  reactions: typeof import("./reactions").reactions;
  rendering: typeof import("./rendering").rendering;
  resources: typeof import("./resources").resources;
  scene: typeof import("./scene").scene;
  schedule: typeof import("./schedule").schedule;
  settings: typeof import("./settings").settings;
  shared: typeof import("./shared").shared;
  signals: typeof import("./signals").signals;
  sound: typeof import("./sound").sound;
  sprites: typeof import("./sprites").sprites;
  storage: typeof import("./storage").storage;
  structureBehaviors: typeof import("./structureBehaviors").structureBehaviors;
  structures: typeof import("./structures").structures;
  tech: typeof import("./tech").tech;
  terrains: typeof import("./terrains").terrains;
  time: typeof import("./time").time;
  tools: typeof import("./tools").tools;
  triggers: typeof import("./triggers").triggers;
  ui: typeof import("./ui").ui;
  upgrades: typeof import("./upgrades").upgrades;
  utils: typeof import("./utils").utils;
  workers: typeof import("./workers").workers;
  world: typeof import("./world").world;
};
