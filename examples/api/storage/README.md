# Storage Example

Persist mod data in the save file with `storage.ensure`.

Pattern from workshop mod `matt.signal-markers`.

## Use

1. Enable the mod and load a save.
2. Look for the toast **Storage — save load count 1**.
3. Reload the same save. The count increases each time the mod loads.

## Copy this mod

Copy `examples/api/storage/` to `src/<your-mod>/`. Use `storage.get`, `storage.set`, and `storage.local` for other persistence needs.
