<script setup lang="ts">
import ItemPreviewPanel from './components/ItemPreviewPanel.vue'
import CharacterPortraitPanel from './components/CharacterPortraitPanel.vue'
import HealthStatusPanel from './components/HealthStatusPanel.vue'
import EquippedWeaponPanel from './components/EquippedWeaponPanel.vue'
import InventoryGrid from './components/InventoryGrid.vue'
import MenuPanel from './components/MenuPanel.vue'
import ItemDescriptionPanel from './components/ItemDescriptionPanel.vue'
import { usePlayerStore } from './stores/player'

const player = usePlayerStore()
</script>

<template>
  <main class="project-shell">
    <div class="project-shell__inventory">
      <ItemPreviewPanel class="project-shell__preview" />
      <div class="project-shell__status">
        <CharacterPortraitPanel />
        <HealthStatusPanel />
        <EquippedWeaponPanel class="project-shell__weapon" :weapon="player.equippedWeapon" />
      </div>
      <div class="project-shell__items">
        <MenuPanel class="project-shell__menu" />
        <InventoryGrid class="project-shell__grid" :slots="player.inventorySlots" />
      </div>
      <ItemDescriptionPanel class="project-shell__description" />
    </div>
  </main>
</template>

<style scoped>
.project-shell {
  display: grid;
  place-content: safe center;
  min-height: 100svh;
  background: var(--color-preview-background);
}

.project-shell__inventory {
  --layout-edge: calc(9 * var(--ui-pixel));
  --layout-panel-gap: calc(2 * var(--ui-pixel));
  --layout-frame-overlap: calc(8 * var(--ui-pixel));

  display: grid;
  grid-template-columns:
    var(--layout-edge)
    calc(220.5 * var(--ui-pixel))
    minmax(0, 1fr)
    var(--layout-edge);
  /* The left panels set the rows. The taller inventory continues behind
     the description instead of stretching the space above the status row. */
  grid-template-rows:
    calc(144 * var(--ui-pixel))
    calc(45 * var(--ui-pixel))
    var(--layout-panel-gap)
    auto;
  grid-template-areas:
    ". preview items ."
    ". status  items ."
    ". .       .     ."
    "description description description description";
  width: calc(360 * var(--ui-pixel));
  padding-block: calc(13.5 * var(--ui-pixel)) var(--layout-edge);
}

.project-shell__preview {
  grid-area: preview;
}

.project-shell__status {
  grid-area: status;
  align-self: end;
  display: grid;
  grid-template-columns:
    calc(70 * var(--ui-pixel))
    calc(72 * var(--ui-pixel))
    calc(76 * var(--ui-pixel));
  column-gap: var(--layout-panel-gap);
  align-items: end;
}

.project-shell__weapon {
  /* Match the housing's right edge to the inventory's left edge;
     the component's reserved connector space is not housing width. */
  margin-left: calc(11 * var(--ui-pixel));
}

.project-shell__items {
  grid-area: items;
  align-self: start;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: auto var(--layout-frame-overlap) auto;
  align-content: start;
}

.project-shell__menu {
  grid-column: 1;
  grid-row: 1 / 3;
  z-index: 1;
}

.project-shell__grid {
  grid-column: 1;
  grid-row: 2 / 4;
  margin-left: calc(4.5 * var(--ui-pixel));
}

.project-shell__description {
  grid-area: description;
  z-index: 2;
  width: 100%;
}
</style>
