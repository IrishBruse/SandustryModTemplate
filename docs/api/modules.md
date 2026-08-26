<div class="smt-api-landing">

# Sandkit API

Sandkit namespaces used by mods. Use groups below to find a namespace. The sidebar lists every page.

## Roots

- [Main thread](api/sandkit.api.md) — `sandkit.api`
- [Worker](api/sandkit.api.worker.md) — worker-thread `sandkit.api`
- [Engine](api/sandkit.engine.md) — `sandkit.engine`
- [Enums](api/sandkit.enums.md) — `sandkit.enums`
- [React](api/sandkit.react.md) — `sandkit.react`
- [sandkit](api/sandkit.md) — root object shape

## Main thread (`sandkit.api`)

### Player & controls

<ul class="smt-api-group">
<li><a href="#/api/sandkit.api.player">player</a><ul class="smt-api-tree"><li><a href="#/api/sandkit.api.player.buildings">buildings</a></li><li><a href="#/api/sandkit.api.player.inventory">inventory</a></li></ul></li>
<li><a href="#/api/sandkit.api.input">input</a></li>
<li><a href="#/api/sandkit.api.action">action</a></li>
<li><a href="#/api/sandkit.api.tools">tools</a><ul class="smt-api-tree"><li><a href="#/api/sandkit.api.tools.grabber">grabber</a></li></ul></li>
<li><a href="#/api/sandkit.api.camera">camera</a></li>
<li><a href="#/api/sandkit.api.authorization">authorization</a></li>
<li><a href="#/api/sandkit.api.cooldown">cooldown</a></li>
</ul>

### World & simulation

<ul class="smt-api-group">
<li><a href="#/api/sandkit.api.world">world</a><ul class="smt-api-tree"><li><a href="#/api/sandkit.api.world.pickups">pickups</a></li></ul></li>
<li><a href="#/api/sandkit.api.elements">elements</a></li>
<li><a href="#/api/sandkit.api.terrains">terrains</a></li>
<li><a href="#/api/sandkit.api.grid">grid</a></li>
<li><a href="#/api/sandkit.api.fire">fire</a></li>
<li><a href="#/api/sandkit.api.excavation">excavation</a></li>
<li><a href="#/api/sandkit.api.reactions">reactions</a></li>
<li><a href="#/api/sandkit.api.raycast">raycast</a></li>
<li><a href="#/api/sandkit.api.random">random</a></li>
<li><a href="#/api/sandkit.api.time">time</a></li>
<li><a href="#/api/sandkit.api.maps">maps</a></li>
</ul>

### Factory & building

<ul class="smt-api-group">
<li><a href="#/api/sandkit.api.structures">structures</a><ul class="smt-api-tree"><li><a href="#/api/sandkit.api.structures.processing">processing</a></li><li><a href="#/api/sandkit.api.structures.recipes">recipes</a></li></ul></li>
<li><a href="#/api/sandkit.api.building">building</a></li>
<li><a href="#/api/sandkit.api.processing">processing</a></li>
<li><a href="#/api/sandkit.api.collector">collector</a></li>
<li><a href="#/api/sandkit.api.energy">energy</a></li>
<li><a href="#/api/sandkit.api.structureBehaviors">structureBehaviors</a></li>
<li><a href="#/api/sandkit.api.patterns">patterns</a></li>
</ul>

### UI & media

<ul class="smt-api-group">
<li><a href="#/api/sandkit.api.ui">ui</a><ul class="smt-api-tree"><li><a href="#/api/sandkit.api.ui.navigation">navigation</a></li><li><a href="#/api/sandkit.api.ui.overlays">overlays</a></li></ul></li>
<li><a href="#/api/sandkit.api.sprites">sprites</a></li>
<li><a href="#/api/sandkit.api.lights">lights</a><ul class="smt-api-tree"><li><a href="#/api/sandkit.api.lights.persistent">persistent</a></li><li><a href="#/api/sandkit.api.lights.vfx">vfx</a></li></ul></li>
<li><a href="#/api/sandkit.api.effects">effects</a></li>
<li><a href="#/api/sandkit.api.rendering">rendering</a></li>
<li><a href="#/api/sandkit.api.sound">sound</a></li>
<li><a href="#/api/sandkit.api.i18n">i18n</a></li>
<li><a href="#/api/sandkit.api.scene">scene</a></li>
</ul>

### Progression & items

<ul class="smt-api-group">
<li><a href="#/api/sandkit.api.tech">tech</a></li>
<li><a href="#/api/sandkit.api.upgrades">upgrades</a></li>
<li><a href="#/api/sandkit.api.discoveries">discoveries</a></li>
<li><a href="#/api/sandkit.api.progression">progression</a></li>
<li><a href="#/api/sandkit.api.resources">resources</a></li>
<li><a href="#/api/sandkit.api.items">items</a></li>
<li><a href="#/api/sandkit.api.projectiles">projectiles</a></li>
</ul>

### Mods & runtime

<ul class="smt-api-group">
<li><a href="#/api/sandkit.api.mods">mods</a></li>
<li><a href="#/api/sandkit.api.settings">settings</a></li>
<li><a href="#/api/sandkit.api.storage">storage</a><ul class="smt-api-tree"><li><a href="#/api/sandkit.api.storage.local">local</a></li></ul></li>
<li><a href="#/api/sandkit.api.assets">assets</a></li>
<li><a href="#/api/sandkit.api.hooks">hooks</a></li>
<li><a href="#/api/sandkit.api.events">events</a></li>
<li><a href="#/api/sandkit.api.triggers">triggers</a></li>
<li><a href="#/api/sandkit.api.schedule">schedule</a></li>
<li><a href="#/api/sandkit.api.workers">workers</a></li>
<li><a href="#/api/sandkit.api.shared">shared</a><ul class="smt-api-tree"><li><a href="#/api/sandkit.api.shared.buffers">buffers</a></li></ul></li>
<li><a href="#/api/sandkit.api.signals">signals</a><ul class="smt-api-tree"><li><a href="#/api/sandkit.api.signals.targets">targets</a></li></ul></li>
<li><a href="#/api/sandkit.api.utils">utils</a></li>
<li><a href="#/api/sandkit.api.constants">constants</a></li>
<li><a href="#/api/sandkit.api.gameConfig">gameConfig</a></li>
</ul>


## Worker (`sandkit.api`)

Worker-thread namespaces. Same names as main where they overlap; pages use a `.worker` URL suffix.

<ul class="smt-api-group">
<li><a href="#/api/sandkit.api.elements.worker">elements</a></li>
<li><a href="#/api/sandkit.api.main.worker">main</a></li>
<li><a href="#/api/sandkit.api.maps.worker">maps</a></li>
<li><a href="#/api/sandkit.api.player.worker">player</a></li>
<li><a href="#/api/sandkit.api.shared.worker">shared</a><ul class="smt-api-tree"><li><a href="#/api/sandkit.api.shared.buffers.worker">buffers</a></li></ul></li>
<li><a href="#/api/sandkit.api.structures.worker">structures</a><ul class="smt-api-tree"><li><a href="#/api/sandkit.api.structures.processing.worker">processing</a></li></ul></li>
<li><a href="#/api/sandkit.api.terrains.worker">terrains</a></li>
<li><a href="#/api/sandkit.api.ui.worker">ui</a></li>
<li><a href="#/api/sandkit.api.worker.worker">worker</a></li>
<li><a href="#/api/sandkit.api.world.worker">world</a></li>
</ul>


## Engine (`sandkit.engine`)

### Game & factory

<ul class="smt-api-group">
<li><a href="#/api/sandkit.engine.api.game">game</a></li>
<li><a href="#/api/sandkit.engine.api.factory">factory</a></li>
<li><a href="#/api/sandkit.engine.api.conveyors">conveyors</a></li>
<li><a href="#/api/sandkit.engine.api.queue">queue</a></li>
<li><a href="#/api/sandkit.engine.api.heatTransfer">heatTransfer</a></li>
</ul>

### Entities & drones

<ul class="smt-api-group">
<li><a href="#/api/sandkit.engine.api.entities">entities</a></li>
<li><a href="#/api/sandkit.engine.api.drones">drones</a></li>
<li><a href="#/api/sandkit.engine.api.sweeperDrone">sweeperDrone</a></li>
<li><a href="#/api/sandkit.engine.api.launchers">launchers</a></li>
<li><a href="#/api/sandkit.engine.api.swarmConsole">swarmConsole</a></li>
</ul>

### World & terrain

<ul class="smt-api-group">
<li><a href="#/api/sandkit.engine.api.matters">matters</a></li>
<li><a href="#/api/sandkit.engine.api.foliage">foliage</a></li>
<li><a href="#/api/sandkit.engine.api.wall">wall</a></li>
<li><a href="#/api/sandkit.engine.api.shadows">shadows</a></li>
<li><a href="#/api/sandkit.engine.api.portals">portals</a></li>
<li><a href="#/api/sandkit.engine.api.teleportZones">teleportZones</a></li>
<li><a href="#/api/sandkit.engine.api.strataform">strataform</a></li>
</ul>

### Prefabs & blueprints

<ul class="smt-api-group">
<li><a href="#/api/sandkit.engine.api.prefabData">prefabData</a></li>
<li><a href="#/api/sandkit.engine.api.prefabDecor">prefabDecor</a></li>
<li><a href="#/api/sandkit.engine.api.prefabulator">prefabulator</a></li>
<li><a href="#/api/sandkit.engine.api.blueprints">blueprints</a></li>
<li><a href="#/api/sandkit.engine.api.clipboard">clipboard</a></li>
</ul>

### Materials & pickers

<ul class="smt-api-group">
<li><a href="#/api/sandkit.engine.api.auralite">auralite</a></li>
<li><a href="#/api/sandkit.engine.api.prismaline">prismaline</a></li>
<li><a href="#/api/sandkit.engine.api.prismite">prismite</a></li>
<li><a href="#/api/sandkit.engine.api.augments">augments</a></li>
<li><a href="#/api/sandkit.engine.api.colorPicker">colorPicker</a></li>
<li><a href="#/api/sandkit.engine.api.coloringTool">coloringTool</a></li>
<li><a href="#/api/sandkit.engine.api.foundationColorPicker">foundationColorPicker</a></li>
<li><a href="#/api/sandkit.engine.api.lightColorPicker">lightColorPicker</a></li>
</ul>

### Debug & misc

<ul class="smt-api-group">
<li><a href="#/api/sandkit.engine.api.debug">debug</a></li>
<li><a href="#/api/sandkit.engine.api.extensions">extensions</a></li>
<li><a href="#/api/sandkit.engine.api.misc">misc</a></li>
<li><a href="#/api/sandkit.engine.api.tutorialBuild">tutorialBuild</a></li>
<li><a href="#/api/sandkit.engine.api.usageTracker">usageTracker</a></li>
<li><a href="#/api/sandkit.engine.api.workerLocal">workerLocal</a></li>
</ul>


## Enums

- [Overview](api/sandkit.enums.md)

<ul class="smt-api-group">
<li><a href="#/api/sandkit.enums.AbilityType">AbilityType</a></li>
<li><a href="#/api/sandkit.enums.ActionState">ActionState</a></li>
<li><a href="#/api/sandkit.enums.ActionType">ActionType</a></li>
<li><a href="#/api/sandkit.enums.AuthorizationType">AuthorizationType</a></li>
<li><a href="#/api/sandkit.enums.BuildingClearance">BuildingClearance</a></li>
<li><a href="#/api/sandkit.enums.BuildMode">BuildMode</a></li>
<li><a href="#/api/sandkit.enums.CellType">CellType</a></li>
<li><a href="#/api/sandkit.enums.ComponentId">ComponentId</a></li>
<li><a href="#/api/sandkit.enums.DroneType">DroneType</a></li>
<li><a href="#/api/sandkit.enums.ElementType">ElementType</a></li>
<li><a href="#/api/sandkit.enums.ItemId">ItemId</a></li>
<li><a href="#/api/sandkit.enums.ItemType">ItemType</a></li>
<li><a href="#/api/sandkit.enums.KeyBinding">KeyBinding</a></li>
<li><a href="#/api/sandkit.enums.KeyState">KeyState</a></li>
<li><a href="#/api/sandkit.enums.MatterType">MatterType</a></li>
<li><a href="#/api/sandkit.enums.ProjectileType">ProjectileType</a></li>
<li><a href="#/api/sandkit.enums.ReloadType">ReloadType</a></li>
<li><a href="#/api/sandkit.enums.Scene">Scene</a></li>
<li><a href="#/api/sandkit.enums.StructureType">StructureType</a></li>
<li><a href="#/api/sandkit.enums.Tech">Tech</a></li>
<li><a href="#/api/sandkit.enums.TechStatus">TechStatus</a></li>
<li><a href="#/api/sandkit.enums.WorldItemType">WorldItemType</a></li>
</ul>


## Shared domain types

- [asset](api/shared.asset.md)
- [engine](api/shared.engine.md)
- [jsonvalue](api/shared.jsonvalue.md)
- [player](api/shared.player.md)

</div>

