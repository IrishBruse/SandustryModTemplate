import { modinfo } from "./modinfo";

const api = sandkit.api;

const TRIGGER_ID = `${modinfo.id}:heartbeat`;
const INTERVAL_TICKS = 300;
const LOG_EVERY_FIRES = 5;

let fires = 0;

api.triggers.register(TRIGGER_ID, {
  interval: INTERVAL_TICKS,
  callback: () => {
    fires += 1;
    if (fires % LOG_EVERY_FIRES !== 0) return;
    console.log(`triggers interval — ${fires} fires (${TRIGGER_ID})`);
  },
});

api.ui.toast("Triggers Interval — open console for heartbeat logs", {});

console.log(`loaded — triggers.register(${TRIGGER_ID}) every ${INTERVAL_TICKS} ticks`);
