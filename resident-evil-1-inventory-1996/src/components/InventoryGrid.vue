<script setup lang="ts">
import { computed } from 'vue'
import BlueSlotBackground from './BlueSlotBackground.vue'
import ItemSelectionOverlay from './ItemSelectionOverlay.vue'
import SpriteFrame from './SpriteFrame.vue'
import { hasAmount } from '../inventory/items'
import type { ResolvedItem } from '../inventory/types'

// null marks an empty slot.
const { slots = [] } = defineProps<{ slots?: (ResolvedItem | null)[] }>()

const cellRows = 34
const cellCount = 8

// Always render every cell; cells beyond the given slots are empty.
const cells = computed(() => Array.from({ length: cellCount }, (_, index) => slots[index] ?? null))

function cellLabel(slot: ResolvedItem | null, index: number): string {
  if (!slot) return `Slot ${index + 1}: empty`
  const { item, definition } = slot
  const amount = hasAmount(definition) ? `, ${item.amount}` : ''
  return `Slot ${index + 1}: ${definition.name}${amount}`
}
</script>

<template>
  <section class="inventory-grid" aria-label="Inventory panel">
    <div class="inventory-grid__recess">
      <ol class="inventory-grid__cells" aria-label="Inventory slots">
        <li
          v-for="(slot, index) in cells"
          :key="index"
          class="inventory-grid__cell"
          :aria-label="cellLabel(slot, index)"
        >
          <BlueSlotBackground :rows="cellRows" />
          <template v-if="slot">
            <SpriteFrame :sprite="slot.definition.sprite" />
            <span v-if="hasAmount(slot.definition)" class="inventory-grid__amount" aria-hidden="true">{{ slot.item.amount }}</span>
          </template>
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
  display: grid;
  place-items: center;
  /* Keep the negative background layer inside its own cell, below the selector. */
  isolation: isolate;
  overflow: hidden;
}

.inventory-grid__amount {
  position: absolute;
  right: calc(2 * var(--ui-pixel));
  bottom: calc(1.5 * var(--ui-pixel));
  color: #009900;
  font-family: 'VT323', monospace;
  font-size: calc(12 * var(--ui-pixel));
  font-weight: 400;
  line-height: 1;
  letter-spacing: var(--ui-pixel);
  /* Same widened digits as the equipped ammo, anchored to the right edge. */
  transform: scaleX(1.4);
  transform-origin: right bottom;
  text-shadow: var(--ui-pixel) 0 #003800;
  pointer-events: none;
}

.inventory-grid__selector {
  /* Removing the SVG from layout also restarts its pulse on the next hover. */
  display: none;
}

@media (hover: hover) {
  .inventory-grid__cell:hover .inventory-grid__selector {
    display: block;
  }
}
</style>
