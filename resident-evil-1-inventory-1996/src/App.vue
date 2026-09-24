<script setup>
import { computed, nextTick, ref } from 'vue'
import ItemActionsMenu from './components/ItemActionsMenu.vue'
import handgunImage from './assets/equipped-handgun.png'
import ItemPreviewPanel from './components/ItemPreviewPanel.vue'
import CharacterPortraitPanel from './components/CharacterPortraitPanel.vue'
import HealthStatusPanel from './components/HealthStatusPanel.vue'
import EquippedWeaponPanel from './components/EquippedWeaponPanel.vue'
import InventoryGrid from './components/InventoryGrid.vue'
import MenuPanel from './components/MenuPanel.vue'
import ItemDescriptionPanel from './components/ItemDescriptionPanel.vue'

// Temporary review fixture; the complete item catalog is a separate step.
const items = [
  { id: 'handgun', name: 'HANDGUN', weapon: true, image: handgunImage },
  { id: 'clip', name: 'CLIP', weapon: false, sprite: { column: 1, row: 1 } },
]
const equippedItemId = ref('handgun')
const selectedIndex = ref(0)
const menuOpen = ref(false)
const message = ref('')
const messageButton = ref(null)
const actionIndex = ref(0)
const selectedItem = computed(() => items[selectedIndex.value])

function openMenu(index) {
  selectedIndex.value = index
  actionIndex.value = 0
  menuOpen.value = true
}

async function handleAction({ action, index }) {
  if (message.value) return
  actionIndex.value = index
  if (action === 'equip' && selectedItem.value?.weapon) {
    equippedItemId.value = equippedItemId.value === selectedItem.value.id ? null : selectedItem.value.id
    await closeMenu()
    return
  }
  message.value = 'This item cannot be used by itself.'
  await nextTick()
  messageButton.value?.focus()
}

function dismissMessage() {
  message.value = ''
}

function onMessageKeydown(event) {
  if (event.key === 'Tab' || (event.repeat && ['Enter', ' ', 'Escape'].includes(event.key))) {
    event.preventDefault()
  } else if (event.key === 'Escape') {
    event.preventDefault()
    dismissMessage()
  }
}

async function closeMenu() {
  menuOpen.value = false
  await nextTick()
  document.getElementById(`inventory-slot-${selectedIndex.value}`)?.focus()
}
</script>

<template>
  <main class="project-shell">
    <div class="project-shell__inventory">
      <ItemPreviewPanel class="project-shell__preview">
        <ItemActionsMenu
          v-if="menuOpen && !message"
          :weapon="selectedItem?.weapon"
          :initial-index="actionIndex"
          @cancel="closeMenu"
          @action="handleAction"
        />
      </ItemPreviewPanel>
      <div class="project-shell__status" :inert="menuOpen">
        <CharacterPortraitPanel />
        <HealthStatusPanel />
        <EquippedWeaponPanel class="project-shell__weapon" :equipped="equippedItemId !== null" />
      </div>
      <div class="project-shell__items">
        <MenuPanel class="project-shell__menu" :inert="menuOpen" />
        <InventoryGrid
          class="project-shell__grid"
          :items="items"
          :selected-index="selectedIndex"
          :menu-open="menuOpen"
          @select="selectedIndex = $event"
          @open="openMenu"
        />
      </div>
      <ItemDescriptionPanel class="project-shell__description" :item-name="selectedItem?.name ?? ''">
        <div v-if="message" role="dialog" aria-modal="true" aria-labelledby="inventory-message" @keydown="onMessageKeydown">
          <button
            id="inventory-message"
            ref="messageButton"
            class="project-shell__message"
            type="button"
            @click="dismissMessage"
          >{{ message }}</button>
        </div>
      </ItemDescriptionPanel>
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

.project-shell__message {
  display: block;
  width: 100%;
  min-height: calc(34 * var(--ui-pixel));
  margin: 0;
  padding: var(--ui-pixel) calc(8 * var(--ui-pixel));
  border: 0;
  background: transparent;
  color: #c1beb2;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: calc(10 * var(--ui-pixel));
  font-weight: 700;
  line-height: 1.2;
  text-align: left;
  cursor: pointer;
  -webkit-text-stroke: calc(0.5 * var(--ui-pixel)) #434356;
  paint-order: stroke fill;
}
</style>
