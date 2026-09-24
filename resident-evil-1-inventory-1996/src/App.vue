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
import { createItem, describeItem } from './inventory/items.js'
import { combineInventoryItems } from './inventory/combinations.js'

// Temporary review fixture; the complete item catalog is a separate step.
const slots = ref([
  createItem('handgun', 'handgun-1', 10),
  createItem('clip', 'clip-1', 15),
  createItem('clip', 'clip-2', 250),
  createItem('greenHerb', 'green-1'),
  createItem('redHerb', 'red-1'),
  createItem('greenHerb', 'green-2'),
  null, null,
])
const items = computed(() => slots.value.map(item => {
  const view = describeItem(item)
  // Preserve the approved extracted handgun artwork in both panels.
  return view?.typeId === 'handgun' ? { ...view, image: handgunImage } : view
}))
const equippedItemId = ref('handgun-1')
const equippedItem = computed(() => items.value.find(item => item?.id === equippedItemId.value) ?? null)
const selectedIndex = ref(0)
const menuOpen = ref(false)
const message = ref('')
const messageButton = ref(null)
const actionIndex = ref(0)
const combineSourceId = ref(null)
const combining = computed(() => combineSourceId.value !== null)
const sourceIndex = computed(() => slots.value.findIndex(item => item?.id === combineSourceId.value))
const menuItem = computed(() => combining.value ? items.value[sourceIndex.value] : selectedItem.value)
const recipeTargetId = ref(null)
const confirmingRecipe = computed(() => recipeTargetId.value !== null)
const selectedItem = computed(() => items.value[selectedIndex.value])

function openMenu(index) {
  if (message.value) return
  if (combining.value) {
    selectCombination(index)
    return
  }
  selectedIndex.value = index
  actionIndex.value = 0
  menuOpen.value = true
}

async function handleAction({ action, index }) {
  if (message.value) return
  actionIndex.value = index
  if (action === 'combine') {
    combineSourceId.value = selectedItem.value.id
    const next = slots.value.findIndex(item => item && item.id !== combineSourceId.value)
    if (next !== -1) selectedIndex.value = next
    await focusSlot()
    return
  }
  if (action === 'equip' && selectedItem.value?.weapon) {
    equippedItemId.value = equippedItemId.value === selectedItem.value.id ? null : selectedItem.value.id
    await closeMenu()
    return
  }
  message.value = 'This item cannot be used by itself.'
  await nextTick()
  messageButton.value?.focus()
}

async function focusSlot() {
  await nextTick()
  document.getElementById(`inventory-slot-${selectedIndex.value}`)?.focus()
}

async function selectCombination(index) {
  selectedIndex.value = index
  const result = combineInventoryItems(slots.value, combineSourceId.value, slots.value[index]?.id)
  if (!result.ok) {
    message.value = result.message
  } else if (result.kind === 'recipe') {
    recipeTargetId.value = slots.value[index].id
    message.value = 'Will you mix these herbs?'
  } else {
    await applyCombination(result)
    return
  }
  await nextTick()
  messageButton.value?.focus()
}

async function applyCombination(result) {
  const originalSource = sourceIndex.value
  const target = selectedIndex.value
  slots.value = result.slots
  selectedIndex.value = slots.value[originalSource] ? originalSource : target
  combineSourceId.value = null
  recipeTargetId.value = null
  message.value = ''
  await closeMenu()
}

async function confirmRecipe() {
  // Confirmation evaluates current inventory again; no cached replacements.
  const result = combineInventoryItems(slots.value, combineSourceId.value, recipeTargetId.value)
  recipeTargetId.value = null
  if (result.ok) await applyCombination(result)
  else {
    message.value = result.message
    await nextTick()
    messageButton.value?.focus()
  }
}

function cancelCombination() {
  selectedIndex.value = sourceIndex.value
  combineSourceId.value = null
  actionIndex.value = 2
}

async function dismissMessage() {
  message.value = ''
  recipeTargetId.value = null
  if (combining.value) await focusSlot()
}

function onMessageKeydown(event) {
  if (event.key === 'Tab') {
    event.preventDefault()
    if (confirmingRecipe.value) {
      const buttons = [...event.currentTarget.querySelectorAll('button')]
      buttons[(buttons.indexOf(document.activeElement) + 1) % buttons.length].focus()
    }
  } else if (event.repeat && ['Enter', ' ', 'Escape'].includes(event.key)) {
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
          :key="combining ? 'target-selection' : 'actions'"
          :weapon="menuItem?.weapon"
          :initial-index="actionIndex"
          :inert="combining"
          @cancel="closeMenu"
          @action="handleAction"
        />
      </ItemPreviewPanel>
      <div class="project-shell__status" :inert="menuOpen">
        <CharacterPortraitPanel />
        <HealthStatusPanel />
        <EquippedWeaponPanel class="project-shell__weapon" :item="equippedItem" />
      </div>
      <div class="project-shell__items">
        <MenuPanel class="project-shell__menu" :inert="menuOpen" />
        <InventoryGrid
          class="project-shell__grid"
          :items="items"
          :selected-index="selectedIndex"
          :menu-open="(menuOpen && !combining) || Boolean(message)"
          :combining="combining"
          :source-index="sourceIndex"
          @select="selectedIndex = $event"
          @open="openMenu"
          @cancel-combine="cancelCombination"
        />
      </div>
      <ItemDescriptionPanel class="project-shell__description" :item-name="selectedItem?.name ?? ''">
        <div v-if="message" role="dialog" aria-modal="true" aria-labelledby="inventory-message" @keydown="onMessageKeydown">
          <template v-if="confirmingRecipe">
            <p id="inventory-message" class="project-shell__recipe-question">{{ message }}</p>
            <div class="project-shell__recipe-options">
              <button ref="messageButton" type="button" @click="confirmRecipe">Yes</button>
              <button type="button" @click="dismissMessage">No</button>
            </div>
          </template>
          <button
            v-else
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

.project-shell__recipe-question,
.project-shell__recipe-options {
  padding-inline: calc(8 * var(--ui-pixel));
  color: #c1beb2;
  font-family: 'VT323', monospace;
  font-size: calc(10 * var(--ui-pixel));
  line-height: 1.2;
}

.project-shell__recipe-options {
  display: flex;
  gap: calc(8 * var(--ui-pixel));
}

.project-shell__recipe-options button {
  padding: 0 var(--ui-pixel);
  border: 0;
  color: inherit;
  background: transparent;
  cursor: pointer;
}
</style>
