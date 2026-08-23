/**
 * `sandkit.enums` members — confirmed against a live Sandustry session.
 *
 * Numeric element / terrain / structure values can change between game
 * versions. Prefer resolving string IDs through the API when possible.
 */

/** Item ability categories (dig, shoot, spray, laser). */
export enum AbilityType {
  Dig = 1,
  Shoot = 2,
  Spray = 3,
  Laser = 4,
}

/** Phases of a held or repeated player action. */
export enum ActionState {
  Start = 1,
  Active = 2,
  End = 3,
}

/** High-level action channel (weapon, building, tool, mod). */
export enum ActionType {
  Weapon = 1,
  Building = 2,
  Tool = 3,
  Mod = 4,
}

/** Zone rules that restrict player abilities. */
export enum AuthorizationType {
  NoJetpack = 1,
  NoGrab = 2,
  NoBuild = 3,
  NoTool = 4,
  NoExcavation = 5,
  NoToolExceptFlamethrower = 6,
}

/** Linear vs rectangular structure placement. */
export enum BuildMode {
  Linear = 1,
  Rectangular = 2,
}

/** Result of a build placement check. */
export enum BuildingClearance {
  Available = 1,
  FullyBlocked = 2,
  PartiallyBlocked = 3,
  CanBeReplaced = 4,
}

/** Terrain / special cell kinds in the simulation grid. */
export enum CellType {
  Empty = 0,
  Element = 1,
  Dirt = 2,
  SporeSoil = 3,
  Fog = 4,
  FogJetpackBlock = 5,
  FogWater = 6,
  FreezingIceSoil = 7,
  Divider = 8,
  Grass = 9,
  Moss = 10,
  GoldSoil = 11,
  Petal = 12,
  FogLava = 13,
  Fluxite = 14,
  Block = 15,
  SlidingBlock = 16,
  SlidingBlockLeft = 17,
  SlidingBlockRight = 18,
  ConveyorLeft = 19,
  ConveyorRight = 20,
  ShakerLeft = 21,
  ShakerRight = 22,
  Stone = 23,
  VelocitySoaker = 24,
  Ice = 25,
  Grower = 26,
  NascentWater = 27,
  SandiumSoil = 28,
  Obsidian = 29,
  Crackstone = 30,
}

/** UI component ids for HUD and menu routing. */
export enum ComponentId {
  Hotbar = 1,
  SoundBoxConfig = 2,
  Root = 4,
  Menu = 5,
  Management = 6,
  FilterConfig = 7,
  Resources = 8,
  TechTree = 9,
  Tutorial = 10,
  Loader = 11,
  Options = 12,
  ShortcutHelper = 13,
  Upgrades = 14,
  Tooltip = 15,
  Notifications = 16,
  Objectives = 17,
  DroneAdminList = 18,
  HotbarOverlays = 19,
  IntroScreen = 20,
  StoryNotifications = 21,
  FactoryProgress = 22,
  Dialogs = 23,
  GlobalOverlays = 24,
  Lexicon = 25,
  ModsScreen = 26,
  CustomMapsScreen = 27,
  CinematicPanel = 28,
  Feedback = 29,
}

/** Autonomous drone kinds. */
export enum DroneType {
  Digger = 1,
  Hauler = 2,
}

/** Built-in element type ids (prefer API string ids when registering mods). */
export enum ElementType {
  Sand = 1,
  Particle = 2,
  Water = 3,
  WetSand = 4,
  Sandium = 5,
  Residue = 6,
  Gold = 7,
  Gloom = 8,
  Shake = 9,
  Steam = 10,
  Fire = 11,
  FreezingIce = 12,
  Flame = 13,
  BurntResidue = 14,
  Seed = 15,
  WetSeed = 16,
  Seedling = 17,
  Petalium = 18,
  Lava = 19,
  Basalt = 20,
}

/** Built-in hotbar item ids. */
export enum ItemId {
  Shovel = 1,
  Grabber = 2,
  Demolisher = 3,
  GrapplingHook = 4,
  Vacuum = 5,
  Gun = 6,
  Copier = 7,
  RocketLauncher = 8,
  Digger = 9,
  Shotgun = 10,
  Teleporter = 11,
  Flamethrower = 12,
  PipeRemover = 13,
  Hauler = 14,
  Cryoblaster = 15,
  MegaShotgun = 16,
}

/** Item category (weapon, tool, consumable, mod). */
export enum ItemType {
  Weapon = 1,
  Tool = 2,
  Consumable = 3,
  Mod = 4,
}

/** Named input bindings (settings keys). */
export enum KeyBinding {
  OpenBuildMenu = "OpenBuildMenu",
  GrapplingHook = "GrapplingHook",
  Escape = "Escape",
  OpenTechTree = "OpenTechTree",
  OpenInventory = "OpenInventory",
  ReverseBuildDirection = "ReverseBuildDirection",
  Marquee = "Marquee",
  Pause = "Pause",
  Copy = "Copy",
  Paste = "Paste",
  Flip = "Flip",
  Delete = "Delete",
  PauseCamera = "PauseCamera",
  OpenUpgrades = "OpenUpgrades",
  BuildMode = "BuildMode",
  Demolish = "Demolish",
  Hover = "Hover",
  Ruler = "Ruler",
  Left = "Left",
  Right = "Right",
  Boost = "Boost",
  Descend = "Descend",
  SprintBoost = "SprintBoost",
  OverrideReplaceStructures = "OverrideReplaceStructures",
  QuickSave = "QuickSave",
  QuickLoad = "QuickLoad",
  ToggleGameHud = "ToggleGameHud",
}

/** Key transition state for input polling. */
export enum KeyState {
  Up = 1,
  Down = 2,
  Pressed = 3,
  Released = 4,
  All = 5,
}

/** Physical behaviour category for elements (mirrors shared API enum). */
export enum MatterType {
  Solid = 1,
  Liquid = 2,
  Particle = 3,
  Gas = 4,
  Static = 5,
  Slushy = 6,
  Wisp = 7,
  Powder = 8,
}

/** Projectile kinds spawned by weapons and tools. */
export enum ProjectileType {
  Bullet = 1,
  Rocket = 2,
  GrapplingHook = 3,
  Fire = 4,
  Digger = 5,
  Mod = 6,
}

/** Weapon reload behaviour. */
export enum ReloadType {
  Clip = 1,
  Single = 2,
  OverTime = 3,
}

/** Top-level game scene (menu, intro, deploy, in-game). */
export enum Scene {
  MainMenu = 1,
  Intro = 2,
  Deploy = 3,
  Game = 4,
}

/** Built-in structure type ids. */
export enum StructureType {
  ConveyorLeft = 1,
  ConveyorRight = 2,
  ShakerLeft = 3,
  ShakerRight = 4,
  LauncherUp = 5,
  LauncherLeft = 6,
  LauncherRight = 7,
  SplitterLeft = 8,
  SplitterRight = 9,
  Dropper = 10,
  Foundation = 11,
  FoundationAngledLeft = 12,
  FoundationTriangleLeftDel = 13,
  FoundationAngledRight = 14,
  FoundationTriangleRightDel = 15,
  Collector = 16,
  FilterLeft = 17,
  FilterRight = 18,
  SlidingFoundation = 19,
  VelocitySoaker = 20,
  Grower = 21,
  SoundBox = 22,
  Pipe = 23,
  Pump = 24,
  LiquidVent = 25,
  Light = 26,
  FluxEmanator = 27,
}

/** Tech tree node ids (mixed numeric and string keys). */
export enum Tech {
  Shaker = 1,
  Conveyors = 2,
  Guns1 = 3,
  Filters1 = 4,
  Flamethrower = 5,
  Gun = 6,
  KineticPress = 7,
  Guns2 = 8,
  Drones1 = 9,
  Upgrading2 = 10,
  Filters2 = 11,
  Upgrading3 = 12,
  Upgrading4 = 13,
  Upgrading5 = 14,
  Upgrading6 = 15,
  Upgrading7 = 16,
  Upgrading8 = 17,
  Upgrading9 = 18,
  Upgrading10 = 19,
  PlanterBox = 20,
  Thermo = 21,
  Rocket = 22,
  Pipes = 23,
  StaticLights = 24,
  Drones2 = 25,
  Smelter = 26,
  Tools4 = 27,
  Guns3 = 28,
  Pipes2 = 29,
  ConveyorsMk2 = 30,
  Lights2 = 31,
  Refining6 = 32,
  Refining7 = 33,
  Guns4 = 34,
  Guns5 = 35,
  Tools5 = 36,
  Tools6 = 37,
  Filters3 = 38,
  Filters4 = 39,
  Pipes3 = 40,
  Pipes4 = 41,
  Logistics3 = 42,
  Logistics4 = 43,
  Lights3 = 44,
  Lights4 = 45,
  Drones3 = 46,
  Drones4 = 47,
  Alien = 48,
  Electricity = 49,
  AlienCore = 50,
  Emanators1 = 51,
  AlienPlasmaConduits = 52,
  AlienQuantumMatrix = 53,
  AlienPlasmaCore = 54,
  AlienVoidEngine = 55,
  FlareGun = 56,
  Sweeper = 57,
  Utilities3 = 58,
  Cryoblaster = 59,
  Vacuum = 60,
  Utilities6 = 61,
  Utilities7 = 62,
  Filters = 63,
  AdvancedFilters = 64,
  Infrastructure3 = 65,
  Decorations1 = 66,
  Decorations2 = 67,
  Decorations3 = 68,
  Blocks1 = 69,
  Drill = 70,
  SteamTurbine = 71,
  Electricity3 = 72,
  Electricity4 = 73,
  Logic1 = 74,
  Logic2 = 75,
  Logic3 = 76,
  Logic4 = 77,
  Various1 = 78,
  Various2 = 79,
  Various3 = 80,
  Locator = 81,
  QuantumPortal = 82,
  VoidRift = 83,
  Blink = 84,
  Recall = 85,
  ImplosionGun = 86,
  Refining8 = 87,
  Tools7 = 88,
  Diggers = 89,
  Haulers = 90,
  Map = 91,
  ColoringTool = 92,
  SignalGate = 93,
  GrapplingHook = 94,
  GlassFoundation = 95,
  PrecisionTools = 96,
  SignalDevices = 97,
  SignalControls = 98,
  LogicGates = 99,
  RetroConsole = 100,
  WallTool = 101,
  Corraller = 102,
  PlainFoundation = 103,
  ClearingFrame = 104,
  Heatmap = 105,
  MiningLaser = 106,
  GoldBattery = 107,
  Hover = 108,
  SprintBoost = 109,
  CritterFence = 110,
  FluxEmanator = "fluxEmanator",
}

/** Visibility and research state of a tech node. */
export enum TechStatus {
  Available = 0,
  Visible = 1,
  Researched = 2,
  Unknown = 3,
  Hidden = 4,
}

/** Pickups and interactable world items. */
export enum WorldItemType {
  Artifact = 1,
  GlyphKey = 2,
  Stratacore = 3,
  Orb = 4,
}

/** Composed `sandkit.enums` object. */
export type SandkitEnums = {
  AbilityType: typeof AbilityType;
  ActionState: typeof ActionState;
  ActionType: typeof ActionType;
  AuthorizationType: typeof AuthorizationType;
  BuildMode: typeof BuildMode;
  BuildingClearance: typeof BuildingClearance;
  CellType: typeof CellType;
  ComponentId: typeof ComponentId;
  DroneType: typeof DroneType;
  ElementType: typeof ElementType;
  ItemId: typeof ItemId;
  ItemType: typeof ItemType;
  KeyBinding: typeof KeyBinding;
  KeyState: typeof KeyState;
  MatterType: typeof MatterType;
  ProjectileType: typeof ProjectileType;
  ReloadType: typeof ReloadType;
  Scene: typeof Scene;
  StructureType: typeof StructureType;
  Tech: typeof Tech;
  TechStatus: typeof TechStatus;
  WorldItemType: typeof WorldItemType;
};
