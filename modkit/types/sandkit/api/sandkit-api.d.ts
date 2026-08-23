/**
 * Composed main-thread `sandkit.api` object type.
 *
 * Each property matches a namespace under `sandkit.api.*`.
 * Namespace members are documented in their module files.
 * Use this type when typing the host `sandkit.api` value as a whole.
 */
export type SandkitApi = {
  /** Player action and custom action data. */
  action: typeof import("./action").action;
  /** Mod asset URLs and provider selection. */
  assets: typeof import("./assets").assets;
  /** Build authorization checks. */
  authorization: typeof import("./authorization").authorization;
  /** Building mode and placement. */
  building: typeof import("./building").building;
  /** Camera position and bounds. */
  camera: typeof import("./camera").camera;
  /** Collector machine helpers. */
  collector: typeof import("./collector").collector;
  /** Shared game constants. */
  constants: typeof import("./constants").constants;
  /** Cooldown timers. */
  cooldown: typeof import("./cooldown").cooldown;
  /** Discovery tracking. */
  discoveries: typeof import("./discoveries").discoveries;
  /** Visual and gameplay effects. */
  effects: typeof import("./effects").effects;
  /** Element types and cell mutations. */
  elements: typeof import("./elements").elements;
  /** Energy network helpers. */
  energy: typeof import("./energy").energy;
  /** Game event subscription. */
  events: typeof import("./events").events;
  /** Excavation helpers. */
  excavation: typeof import("./excavation").excavation;
  /** Fire and burning helpers. */
  fire: typeof import("./fire").fire;
  /** Game configuration values. */
  gameConfig: typeof import("./gameconfig").gameConfig;
  /** Grid metrics and cell helpers. */
  grid: typeof import("./grid").grid;
  /** Intercept and modify hooks. */
  hooks: typeof import("./hooks").hooks;
  /** Localization strings. */
  i18n: typeof import("./i18n").i18n;
  /** Input state and bindings. */
  input: typeof import("./input").input;
  /** Item definitions and inventory. */
  items: typeof import("./items").items;
  /** Dynamic light sources. */
  lights: typeof import("./lights").lights;
  /** Map selection and session start. */
  maps: typeof import("./maps").maps;
  /** Mod asset provider lookup. */
  mods: typeof import("./mods").mods;
  /** Excavation pattern helpers. */
  patterns: typeof import("./patterns").patterns;
  /** Player position, movement, and inventory. */
  player: typeof import("./player").player;
  /** Processing recipe registration. */
  processing: typeof import("./processing").processing;
  /** Story progression completion. */
  progression: typeof import("./progression").progression;
  /** Projectile spawn and lifecycle. */
  projectiles: typeof import("./projectiles").projectiles;
  /** Game random number helpers. */
  random: typeof import("./random").random;
  /** World raycast queries. */
  raycast: typeof import("./raycast").raycast;
  /** Element contact reactions. */
  reactions: typeof import("./reactions").reactions;
  /** Screen drawing and overlay canvas. */
  rendering: typeof import("./rendering").rendering;
  /** Fluxite and energy resources. */
  resources: typeof import("./resources").resources;
  /** Active game scene. */
  scene: typeof import("./scene").scene;
  /** Next-tick callback scheduling. */
  schedule: typeof import("./schedule").schedule;
  /** Game settings read and change events. */
  settings: typeof import("./settings").settings;
  /** Cross-thread shared buffers. */
  shared: typeof import("./shared").shared;
  /** Signal target registration. */
  signals: typeof import("./signals").signals;
  /** Sound playback and stop controls. */
  sound: typeof import("./sound").sound;
  /** Sprite load and transforms. */
  sprites: typeof import("./sprites").sprites;
  /** Per-mod and local storage. */
  storage: typeof import("./storage").storage;
  /** Conveyor and launcher behaviors. */
  structureBehaviors: typeof import("./structureBehaviors").structureBehaviors;
  /** Structure registration and queries. */
  structures: typeof import("./structures").structures;
  /** Tech tree definitions and locks. */
  tech: typeof import("./tech").tech;
  /** Terrain registration and mutations. */
  terrains: typeof import("./terrains").terrains;
  /** Game time and tick counter. */
  time: typeof import("./time").time;
  /** Tool-specific helpers. */
  tools: typeof import("./tools").tools;
  /** Interval trigger registration. */
  triggers: typeof import("./triggers").triggers;
  /** UI overlays, dialogs, and navigation. */
  ui: typeof import("./ui").ui;
  /** Upgrade categories and levels. */
  upgrades: typeof import("./upgrades").upgrades;
  /** Vector math helpers. */
  utils: typeof import("./utils").utils;
  /** Worker post-update control. */
  workers: typeof import("./workers").workers;
  /** World cells, fog, redraw, and pickups. */
  world: typeof import("./world").world;
};
