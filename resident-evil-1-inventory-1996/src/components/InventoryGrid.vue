<script setup lang="ts">
import { computed } from 'vue'
import BlueSlotBackground from './BlueSlotBackground.vue'
import ItemSelectionOverlay from './ItemSelectionOverlay.vue'
import SpriteFrame from './SpriteFrame.vue'
import type { Sprite } from '../sprites/spriteSheet'

interface GridItem {
  name: string
  sprite: Sprite
}

// null marks an empty slot.
const { items = [] } = defineProps<{ items?: (GridItem | null)[] }>()

const cellRows = 34
const cellCount = 8

// Always render every cell; slots beyond the given items are empty.
const cells = computed(() => Array.from({ length: cellCount }, (_, index) => items[index] ?? null))
</script>

<template>
  <section class="inventory-grid" aria-label="Inventory panel">
    <div class="inventory-grid__recess">
      <ol class="inventory-grid__cells" aria-label="Inventory slots">
        <li
          v-for="(item, index) in cells"
          :key="index"
          class="inventory-grid__cell"
          :aria-label="`Slot ${index + 1}: ${item?.name ?? 'empty'}`"
        >
          <BlueSlotBackground :rows="cellRows" />
          <SpriteFrame v-if="item" :sprite="item.sprite" />
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
