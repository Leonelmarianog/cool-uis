<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import ItemPreviewPanel from './components/ItemPreviewPanel.vue'
import CharacterPortraitPanel from './components/CharacterPortraitPanel.vue'
import HealthStatusPanel from './components/HealthStatusPanel.vue'
import EquippedWeaponPanel from './components/EquippedWeaponPanel.vue'
import InventoryGrid from './components/InventoryGrid.vue'
import MenuPanel from './components/MenuPanel.vue'
import ItemDescriptionPanel from './components/ItemDescriptionPanel.vue'
import ItemActionMenu from './components/ItemActionMenu.vue'
import { useInventoryStore } from './stores/inventory'
import { usePlayerStore } from './stores/player'

const player = usePlayerStore()
const inventory = useInventoryStore()

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') inventory.backOut()
}

// Placeholder until each action is implemented.
function onChooseAction(action: string) {
  console.log(`${action}: ${inventory.selectedItem?.name}`);
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <main class="project-shell">
    <div class="project-shell__inventory">
      <ItemPreviewPanel class="project-shell__preview">
        <!-- The red frame stays on the first option until hover moves it. -->
        <ItemActionMenu
          v-if="inventory.isSelecting"
          :options="inventory.itemActions"
          :highlighted="0"
          @choose="onChooseAction"
        />
      </ItemPreviewPanel>
      <div class="project-shell__status">
        <CharacterPortraitPanel />
        <HealthStatusPanel />
        <EquippedWeaponPanel class="project-shell__weapon" :weapon="player.equippedWeapon" />
      </div>
      <div class="project-shell__items">
        <MenuPanel class="project-shell__menu" />
        <InventoryGrid
          class="project-shell__grid"
          :size="player.inventorySize"
          :slots="player.inventorySlots"
          :cursor-slot="inventory.cursorSlot"
          :locked="inventory.isSelecting"
          @hover="inventory.moveCursor"
          @select="inventory.selectItemAt"
        />
      </div>
      <ItemDescriptionPanel class="project-shell__description" :item-name="inventory.itemUnderCursor?.name" />
    </div>
  </main>
</template>

<style scoped>
.project-shell {
  display: grid;
  place-content: start;
  min-height: 100svh;
  /* Center the layout (320 × 240 game pixels) on whole CSS pixels,
     so every game pixel stays aligned to the screen's pixels. */
  padding-top: max(0px, round(down, (100svh - 240 * var(--game-pixel)) / 2, 1px));
  padding-left: max(0px, round(down, (100vw - 320 * var(--game-pixel)) / 2, 1px));
  background: var(--color-preview-background);
}

.project-shell__inventory {
  --layout-edge: calc(8 * var(--game-pixel));
  --layout-panel-gap: calc(2 * var(--game-pixel));
  --layout-frame-overlap: calc(4 * var(--game-pixel));

  display: grid;
  grid-template-columns:
    var(--layout-edge)
    calc(196 * var(--game-pixel))
    minmax(0, 1fr)
    var(--layout-edge);
  /* The left panels set the rows. The taller inventory continues behind
     the description instead of stretching the space above the status row. */
  grid-template-rows:
    calc(128 * var(--game-pixel))
    calc(40 * var(--game-pixel))
    var(--layout-panel-gap)
    auto;
  grid-template-areas:
    ". preview items ."
    ". status  items ."
    ". .       .     ."
    "description description description description";
  width: calc(320 * var(--game-pixel));
  padding-block: calc(12 * var(--game-pixel)) var(--layout-edge);
}

.project-shell__preview {
  grid-area: preview;
}

.project-shell__status {
  grid-area: status;
  align-self: end;
  display: grid;
  grid-template-columns:
    calc(64 * var(--game-pixel))
    calc(64 * var(--game-pixel))
    calc(68 * var(--game-pixel));
  align-items: end;
}

.project-shell__weapon {
  /* The connector overlaps the inventory's left edge. */
  z-index: 1;
  margin-left: calc(12 * var(--game-pixel));
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
  margin-left: calc(4 * var(--game-pixel));
}

.project-shell__description {
  grid-area: description;
  z-index: 2;
  width: 100%;
}
</style>
