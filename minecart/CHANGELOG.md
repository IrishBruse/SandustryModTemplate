# Changelog

## 0.1.3

- Removed: Hoist Dock structure and vertical cage travel. Use rail inclines instead.

## 0.1.2

- Fixed: loader hopper no longer shows red Block terrain in the funnel. Shape matches the sprite (open cells stay empty, like rails).
- Fixed: powder and liquid rest on the loader pad. They no longer fall through.
- Fixed: a cart on the rail under the loader fills from the pile on the pad and the track.
- Fixed: an incline that climbs to the left shows the correct slope.
- Changed: place the unloader under the rail. It is solid. Cargo drops out the bottom onto belts.

## 0.1.1

- Fixed: rails no longer fill with red tiles. Carts sit on the track at the size of one rail tile.
- Fixed: placing rail on powder or liquid no longer leaves red tiles.
- Added: demolish (**X**) a cart to remove it.
- Changed: carts use a side-view wagon with wheels. They no longer look like drones.
- Changed: minecarts are larger on the track and slide between rails instead of jumping.
- Fixed: the loader sucks powder and liquid from the pile on the pad.
- Changed: Building has one **Minecart Rail** under **Minecarts**. Drag diagonally for an incline.
- Changed: click a rail with the **Minecart** tool to place a cart. There is no extra hotkey.
- Fixed: click places a cart on the rail under the cursor.

## 0.1.0

- Added: minecart rail, loader, unloader, and a powered hoist. Drag rail diagonally for an incline.
- Added: press **M** on a rail cell to spawn a cart. Carts haul bulk powder and liquid to the unloader.
- Changed: one **Minecart Rail** building. Drag diagonally to place an incline.
- Changed: place a cart with **N** (not **M**, which opens the map). The Minecart tool is under Construction with a cart icon.
