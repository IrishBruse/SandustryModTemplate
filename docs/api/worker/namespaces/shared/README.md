# shared

**`Internal`**

Worker thread only.

`sandkit.api.shared` — shared memory buffers for workers.

Workers **require** buffers created on the main thread. Main thread only
**gets** existing buffers. See shared for the shared base declarations.

 Worker extension of shared; not interchangeable with
main-thread `sandkit.api.shared`.

## Namespaces

| Namespace | Description |
| ------ | ------ |
| [buffers](api/worker/namespaces/shared/namespaces/buffers/README.md) | Named shared memory buffers for worker threads. |

## References

### SharedArray

Re-exports [SharedArray](api/sandkit/api/namespaces/shared/README.md#sharedarray)

***

### SharedArrayType

Re-exports [SharedArrayType](api/sandkit/api/namespaces/shared/README.md#sharedarraytype)
