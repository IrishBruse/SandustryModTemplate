import { isEnabled } from "@modkit/utils";

const api = sandkit.api;
const { Tech, KeyBinding } = sandkit.enums;

/** Game default: `0.06 * 60 * 60` from `sandustry/dist/js/bundle.js`. */
const BASE_GRAVITY = 0.06 * 60 * 60;
/** Extra gravity multiplier (1.75 = 75% stronger fall). */
const GRAVITY_MULT = 1.75;
/** Walk speed while sprinting on ground. Vanilla walk is 1. */
const RUN_SPEED_MULT = 1.6;
/**
 * Walk speed when not sprinting.
 * Vanilla Sprint Boost only runs when `movementSpeedMultiplier` is exactly 1.
 */
const WALK_SPEED_MULT = 1.0001;
const AUTO_STEP_CELLS = 3;
/** Upward velocity (negative y). Higher magnitude = taller jump. */
export const JUMP_VELOCITY = -380;
const JUMP_COOLDOWN_MS = 450;
/** How long an early jump press is remembered before landing. */
const JUMP_BUFFER_MS = 120;

type HoveringPlayer = {
  isHovering: boolean;
  velocity?: { x: number; y: number };
};

type SessionInput = {
  input?: {
    action?: {
      boost?: false | string;
    };
  };
};

type InterceptContext = {
  cancel?: () => void;
};

type KeydownArgs = {
  key?: string;
  code?: string;
  event?: KeyboardEvent;
};

let lastJumpAt = 0;
let jumpBufferedAt = 0;

type SessionKeys = Record<string, number | undefined>;

function clearJumpBuffer() {
  jumpBufferedAt = 0;
}

function bufferJumpPress() {
  jumpBufferedAt = performance.now();
}

function isJumpBuffered(now = performance.now()): boolean {
  if (jumpBufferedAt === 0) return false;
  return now - jumpBufferedAt <= JUMP_BUFFER_MS;
}

function cancelInputIntercept(context: InterceptContext) {
  context.cancel?.();
}

function playerSnapshot(): HoveringPlayer | null {
  const store = sandkit.state.store as { player?: HoveringPlayer };
  return store.player ?? null;
}

function sessionInput(): SessionInput["input"] | null {
  const session = sandkit.state.session as SessionInput;
  return session.input ?? null;
}

function isSurvivalActive(): boolean {
  return isEnabled(api);
}

function readMaxStepCells(): number {
  const value = api.settings.get("maxStepCells");
  if (typeof value !== "number" || !Number.isFinite(value)) return AUTO_STEP_CELLS;
  return Math.min(8, Math.max(1, Math.floor(value)));
}

function keyMatchesBinding(bindingId: string, key?: string, code?: string): boolean {
  if (!key && !code) return false;
  for (const bound of api.input.getBoundKeys(bindingId)) {
    if (code && bound === code) return true;
    if (key && bound === key) return true;
  }
  return false;
}

/**
 * Session `input.keys` uses `KeyboardEvent.code`.
 * Bindings may store modifier aliases (`Shift`, `Alt`, `Control`, `Meta`).
 */
const MODIFIER_KEY_CODES: Record<string, readonly string[]> = {
  Shift: ["ShiftLeft", "ShiftRight"],
  Alt: ["AltLeft", "AltRight"],
  Control: ["ControlLeft", "ControlRight"],
  Meta: ["MetaLeft", "MetaRight"],
};

function codesForBoundKey(bound: string): readonly string[] {
  return MODIFIER_KEY_CODES[bound] ?? [bound];
}

function isJumpKey(payload: KeydownArgs): boolean {
  if (payload.code === "Space" || payload.key === " ") return true;
  return keyMatchesBinding(KeyBinding.Boost, payload.key, payload.code);
}

function inputKeys(): SessionKeys {
  const session = sandkit.state.session as { input?: { keys?: SessionKeys } };
  return session.input?.keys ?? {};
}

function isKeyBindingActive(bindingId: string, keys = inputKeys()): boolean {
  const { KeyState } = sandkit.enums;
  const activeStates = [KeyState.Down, KeyState.Pressed, KeyState.All];
  for (const bound of api.input.getBoundKeys(bindingId)) {
    for (const code of codesForBoundKey(bound)) {
      const state = keys[code];
      if (state !== undefined && activeStates.includes(state)) return true;
    }
  }
  return false;
}

function isSprintKeyDown(): boolean {
  return isKeyBindingActive(KeyBinding.SprintBoost);
}

function isMovingHorizontally(): boolean {
  return isKeyBindingActive(KeyBinding.Left) || isKeyBindingActive(KeyBinding.Right);
}

function shouldSprint(): boolean {
  return isSprintKeyDown() && isMovingHorizontally() && api.player.isOnGround();
}

function clearVerticalBoost() {
  const action = sessionInput()?.action;
  if (action?.boost) {
    action.boost = false;
  }
}

function applyRunSpeed() {
  if (!isSurvivalActive()) return;

  const session = sandkit.state.session as {
    movementSpeedMultiplier?: number;
    sprintBoost?: { meter: number; recharging: boolean };
  };
  const current = session.movementSpeedMultiplier ?? 1;
  if (current === 0) return;

  const target = shouldSprint() ? RUN_SPEED_MULT : WALK_SPEED_MULT;
  if (current !== target) {
    api.player.setMovementSpeedMultiplier(target);
  }

  const boost = session.sprintBoost;
  if (boost && (boost.meter !== 1 || boost.recharging)) {
    boost.meter = 1;
    boost.recharging = false;
  }
}

function resetRunSpeed() {
  const session = sandkit.state.session as { movementSpeedMultiplier?: number };
  const current = session.movementSpeedMultiplier ?? 1;
  if (current !== 0 && current !== 1) {
    api.player.setMovementSpeedMultiplier(1);
  }
}

function tryJump(): boolean {
  if (!api.player.isOnGround()) return false;

  const now = performance.now();
  if (now - lastJumpAt < JUMP_COOLDOWN_MS) return false;

  const player = playerSnapshot();
  if (!player?.velocity) return false;

  player.velocity.y = JUMP_VELOCITY;
  lastJumpAt = now;
  clearJumpBuffer();
  return true;
}

function processJumpBuffer() {
  const now = performance.now();
  if (!isJumpBuffered(now)) {
    if (jumpBufferedAt !== 0) clearJumpBuffer();
    return;
  }
  tryJump();
}

function forceGroundMode() {
  api.tech.setLockedById(Tech.Hover, true);
  api.tech.setLockedById(Tech.SprintBoost, true);

  const player = playerSnapshot();
  if (!player) return;

  if (player.isHovering) {
    api.player.setMovementMode("normal");
  }
}

function applyExtraGravity(dt: number) {
  const player = playerSnapshot();
  if (!player?.velocity || player.isHovering) return;

  player.velocity.y += 2 * BASE_GRAVITY * (GRAVITY_MULT - 1) * dt;
}

export function applySurvivalMovementRules(): void {
  if (!isSurvivalActive()) return;
  forceGroundMode();
  clearVerticalBoost();
  applyRunSpeed();
}

export function installMovementHooks(): () => void {
  const stopBoostDown = api.hooks.intercept("input:boost-down", (_args, context) => {
    if (!isSurvivalActive()) return;
    cancelInputIntercept(context as InterceptContext);
    bufferJumpPress();
    tryJump();
  });

  const stopDescendDown = api.hooks.intercept("input:descend-down", (_args, context) => {
    if (!isSurvivalActive()) return;
    cancelInputIntercept(context as InterceptContext);
  });

  const stopHoverKey = api.hooks.intercept("input:keydown", (args, context) => {
    if (!isSurvivalActive()) return;
    const payload = args as KeydownArgs;
    if (keyMatchesBinding(KeyBinding.Hover, payload.key, payload.code)) {
      cancelInputIntercept(context as InterceptContext);
      return;
    }
    if (payload.event?.repeat) return;
    if (!isJumpKey(payload)) return;
    bufferJumpPress();
    tryJump();
  });

  const stopCollision = api.events.on("player:collision:prepare", (payload) => {
    if (!isSurvivalActive()) return;
    payload.maxStepCells = readMaxStepCells();
  });

  const stopMoved = api.events.on("player:moved", (payload) => {
    if (!isSurvivalActive()) return;
    if (typeof payload.dt === "number" && payload.dt > 0) {
      applyExtraGravity(payload.dt);
    }
    forceGroundMode();
    clearVerticalBoost();
    applyRunSpeed();
    processJumpBuffer();
  });

  const stopFrame = api.events.on("frame:render", () => {
    if (!isSurvivalActive()) return;
    forceGroundMode();
    clearVerticalBoost();
    applyRunSpeed();
    processJumpBuffer();
  });

  return () => {
    stopBoostDown();
    stopDescendDown();
    stopHoverKey();
    stopCollision();
    stopMoved();
    stopFrame();
    resetRunSpeed();
  };
}
