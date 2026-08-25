# sandkit.api.shared (worker)

**`Internal`**

Worker thread only.

`sandkit.api.shared` — shared memory buffers for workers.

Workers **require** buffers created on the main thread. Main thread only
**gets** existing buffers. See shared for the shared base declarations.

 Worker extension of shared; not interchangeable with
main-thread `sandkit.api.shared`.

## Namespaces <!-- {docsify-ignore} -->

| Namespace | Description |
| ------ | ------ |
| [buffers](api/worker/namespaces/shared/namespaces/buffers/README.md) | Named shared memory buffers for worker threads. |

## References <!-- {docsify-ignore} -->

### sandkit.api.shared.SharedArray (worker) :id=sharedarray

Re-exports [SharedArray](api/sandkit/api/namespaces/shared/README.md#sharedarray)

***

### sandkit.api.shared.SharedArrayType (worker) :id=sharedarraytype

Re-exports [SharedArrayType](api/sandkit/api/namespaces/shared/README.md#sharedarraytype)
