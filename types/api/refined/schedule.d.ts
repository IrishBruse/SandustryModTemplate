export interface ScheduleApi {
  nextTick(fn: () => void): void;
}
