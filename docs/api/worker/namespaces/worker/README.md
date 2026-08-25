# sandkit.api.worker (worker)

**`Internal`**

Worker thread only.

`sandkit.api.worker` — identity of the current simulation worker.

 Base shape reused by [WorkerSandkitApi](api/worker/README.md#workersandkitapi). Not the same as
main-thread APIs.

## Functions <!-- {docsify-ignore} -->

### sandkit.api.worker.getIndex() (worker) :id=getindex

```ts
getIndex(): number
```

Defined in: [worker/api/worker.d.ts:14](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/worker/api/worker.d.ts#L14)

Return the zero-based index of this worker in the worker pool.

#### Returns

`number`

Worker index (`0` … `getCount() - 1`).

***

### sandkit.api.worker.getCount() (worker) :id=getcount

```ts
getCount(): number
```

Defined in: [worker/api/worker.d.ts:19](https://github.com/IrishBruse/SandustryModTemplate/blob/main/modkit/types/worker/api/worker.d.ts#L19)

Return the total number of simulation workers.

#### Returns

`number`

Worker count for the active simulation.
