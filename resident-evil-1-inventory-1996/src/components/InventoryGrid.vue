<script setup>
import BlueSlotBackground from './BlueSlotBackground.vue'
import ItemSelectionOverlay from './ItemSelectionOverlay.vue'

const cellRows = 34
const cellCount = 8
defineProps({
  items: { type: Array, default: () => [] },
  selectedIndex: { type: Number, default: -1 },
  menuOpen: Boolean,
})
const emit = defineEmits(['select', 'open'])

function move(event, index) {
  const offsets = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -2, ArrowDown: 2 }
  if (!(event.key in offsets)) return
  event.preventDefault()
  const target = index + offsets[event.key]
  if (target < 0 || target >= cellCount) return
  if (event.key === 'ArrowLeft' && index % 2 === 0) return
  if (event.key === 'ArrowRight' && index % 2 === 1) return
  event.currentTarget.parentElement.parentElement.children[target].querySelector('button').focus()
}
</script>

<template>
  <section class="inventory-grid" :class="{ 'inventory-grid--locked': menuOpen }" aria-label="Inventory panel">
    <div class="inventory-grid__recess">
      <ol class="inventory-grid__cells" aria-label="Inventory slots">
        <li
          v-for="cell in cellCount"
          :key="cell"
          class="inventory-grid__cell"
          :class="{ 'inventory-grid__cell--selected': selectedIndex === cell - 1 }"
        >
          <BlueSlotBackground :rows="cellRows" />
          <button
            :id="`inventory-slot-${cell - 1}`"
            class="inventory-grid__item"
            type="button"
            :disabled="menuOpen"
            :aria-label="`Slot ${cell}: ${items[cell - 1]?.name ?? 'empty'}`"
            :aria-haspopup="items[cell - 1] ? 'menu' : undefined"
            :tabindex="selectedIndex === cell - 1 || (selectedIndex < 0 && cell === 1) ? 0 : -1"
            @focus="emit('select', cell - 1)"
            @pointerenter="!menuOpen && emit('select', cell - 1)"
            @click="items[cell - 1] && emit('open', cell - 1)"
            @keydown="move($event, cell - 1)"
          >
            <img v-if="items[cell - 1]?.image" :src="items[cell - 1].image" alt="" />
          </button>
          <ItemSelectionOverlay class="inventory-grid__selector" />
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.inventory-grid {
  /* Same three-tone tube palette as the portrait, plus the separating ring. */
  --inventory-tube-dark: var(--color-panel-tube-dark);
  --inventory-tube-mid: var(--color-panel-tube-mid);
  --inventory-tube-light: var(--color-panel-tube-light);
  --inventory-ring: #192019;
  --inventory-bevel-dark: #050025;
  --inventory-bevel-light: #100078;

  /* Derive the panel width and grid tracks from the same column geometry. */
  --inventory-columns: 2;
  --inventory-frame-width: calc(8 * var(--ui-pixel));
  --inventory-bevel-width: calc(4.5 * var(--ui-pixel));
  --inventory-cell-width: calc(45 * var(--ui-pixel));
  --inventory-cell-height: calc(v-bind(cellRows) * var(--ui-pixel));
  --inventory-content-width: calc(var(--inventory-columns) * var(--inventory-cell-width));
  --inventory-edge-width: calc(var(--inventory-frame-width) + var(--inventory-bevel-width));

  position: relative;
  width: calc(var(--inventory-content-width) + 2 * var(--inventory-edge-width));
  padding: var(--inventory-frame-width);
  background: var(--inventory-ring);
}

/* Eight one-art-pixel bands, outside to inside: dark, mid, light, mid,
   separator, mid, light, mid. The inner tube has no final dark edge.
   Smaller inset shadows come first so each covers the next band's overlap. */
.inventory-grid::before {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
  box-shadow:
    inset 0 0 0 var(--ui-pixel) var(--inventory-tube-dark),
    inset 0 0 0 calc(2 * var(--ui-pixel)) var(--inventory-tube-mid),
    inset 0 0 0 calc(3 * var(--ui-pixel)) var(--inventory-tube-light),
    inset 0 0 0 calc(4 * var(--ui-pixel)) var(--inventory-tube-mid),
    inset 0 0 0 calc(5 * var(--ui-pixel)) var(--inventory-ring),
    inset 0 0 0 calc(6 * var(--ui-pixel)) var(--inventory-tube-mid),
    inset 0 0 0 calc(7 * var(--ui-pixel)) var(--inventory-tube-light),
    inset 0 0 0 var(--inventory-frame-width) var(--inventory-tube-mid);
}

.inventory-grid__recess {
  /* Equal border widths form the diagonal miter at every inner corner. */
  border: var(--inventory-bevel-width) solid;
  border-top-color: var(--inventory-bevel-dark);
  border-left-color: var(--inventory-bevel-dark);
  border-right-color: var(--inventory-bevel-light);
  border-bottom-color: var(--inventory-bevel-light);
}

.inventory-grid__cells {
  display: grid;
  grid-template-columns: repeat(var(--inventory-columns), var(--inventory-cell-width));
  grid-auto-rows: var(--inventory-cell-height);
  margin: 0;
  padding: 0;
  list-style: none;
}

.inventory-grid__cell {
  position: relative;
  /* Keep the negative background layer inside its own cell, below the selector. */
  isolation: isolate;
  overflow: hidden;
}

.inventory-grid__selector {
  /* Removing the SVG from layout also restarts its pulse on the next hover. */
  display: none;
}

.inventory-grid__item {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.inventory-grid__item img {
  width: calc(39 * var(--ui-pixel));
  image-rendering: pixelated;
}

.inventory-grid__cell--selected .inventory-grid__selector {
  display: block;
}

@media (hover: hover) {
  .inventory-grid:not(.inventory-grid--locked) .inventory-grid__cell:hover .inventory-grid__selector {
    display: block;
  }
}
</style>
