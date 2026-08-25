# Workers and scheduling

## Config

`__debug.config.useMultithreading` - **true** (live).

## `environment.multithreading.simulation` (live)

| Part                        | Role                             |
| --------------------------- | -------------------------------- |
| `manager`                   | Sim manager worker handle        |
| `utility`, `utilityChannel` | Utility worker side channel      |
| `threads`                   | **14** entries                   |
| `resolvers`                 | Promise resolvers for worker RPC |

Each `threads[i].meta`:

| Field           | Live                 |
| --------------- | -------------------- |
| `startingIndex` | 0 ... 13 (thread id) |
| `threadCount`   | 14                   |
| `ports`         | 14 MessagePorts      |
| `managerPort`   | Manager port         |

Exact cell-row ownership per thread: **not** confirmed in this pass (see `gaps.md`).

## Shared scheduling fields

On **`shared`**, not `__debug.config` (config has no scheduling keys on live 0.5.2).

| Field                 | Live                | Notes                   |
| --------------------- | ------------------- | ----------------------- |
| `shared.schedulingMode`      | object `{ "0": 1 }` | Mode map per worker group |
| `shared.hybridScheduling`    | object `{ "0": 1 }` | Hybrid flag map         |
| `__debug.getSchedulingMode()` | returns **1**       | Sync read; do not call `setSchedulingMode` in probes |

Do not call `__debug.setSchedulingMode` without user ask.

## Chunk sim flags

`shared.sim.chunkShouldUpdate` and `chunkShouldUpdateNext` - `Uint8Array`, len **9216** (= 96 chunks).

Value **1** = chunk marked for update (live sample at map center chunk).

## Performance bags

`shared.workerPerformance` (len 56), `workerDetailPerformance`, `workerCompletion`, `workQueue`, `managerPerformance` - timing and queues. Do not dump.

## Public mod API

`sandkit.api.workers.setPostUpdateEnabled(enabled)` - toggle worker post-update hooks only.

Worker-thread `sandkit` shape: **sandustry-internals** `references/gaps.md`.
